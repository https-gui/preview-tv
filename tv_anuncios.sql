-- ============================================================
--  TV ANÚNCIOS — Schema do Banco de Dados
--  Compatível com: MySQL 8+ / MariaDB 10.5+
--  Hospedagem local, acesso via rede interna
-- ============================================================

CREATE DATABASE IF NOT EXISTS tv_anuncios
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE tv_anuncios;

-- ============================================================
--  TABELA: playlists
--  Cada TV/terminal pode ter sua própria playlist
-- ============================================================
CREATE TABLE IF NOT EXISTS playlists (
  id            INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
  nome          VARCHAR(100)    NOT NULL DEFAULT 'Playlist Principal',
  loop_mode     ENUM('loop','once') NOT NULL DEFAULT 'loop',
  default_duration INT UNSIGNED NOT NULL DEFAULT 10 COMMENT 'Duração padrão das imagens (segundos)',
  show_clock    TINYINT(1)      NOT NULL DEFAULT 1 COMMENT '1 = mostrar relógio na TV',
  ativa         TINYINT(1)      NOT NULL DEFAULT 1,
  criada_em     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizada_em DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
                                ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Playlist padrão
INSERT INTO playlists (nome) VALUES ('Playlist Principal');


-- ============================================================
--  TABELA: midias
--  Catálogo de arquivos de mídia disponíveis
-- ============================================================
CREATE TABLE IF NOT EXISTS midias (
  id            INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
  nome_arquivo  VARCHAR(255)    NOT NULL COMMENT 'Nome original do arquivo',
  nome_salvo    VARCHAR(255)    NOT NULL COMMENT 'Nome gerado no servidor (uuid + ext)',
  tipo          ENUM('image','video') NOT NULL,
  mime_type     VARCHAR(100)    NOT NULL COMMENT 'Ex: image/jpeg, video/mp4',
  tamanho_bytes BIGINT UNSIGNED NOT NULL DEFAULT 0,
  caminho       VARCHAR(500)    NOT NULL COMMENT 'Caminho relativo em /uploads',
  criada_em     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- ============================================================
--  TABELA: playlist_itens
--  Itens de uma playlist (mídia + configurações + ordem)
-- ============================================================
CREATE TABLE IF NOT EXISTS playlist_itens (
  id            INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
  playlist_id   INT UNSIGNED    NOT NULL,
  midia_id      INT UNSIGNED    NOT NULL,
  ordem         SMALLINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Posição na fila (0-based)',
  titulo        VARCHAR(200)    DEFAULT NULL COMMENT 'Título exibido sobre a mídia',
  subtitulo     VARCHAR(300)    DEFAULT NULL COMMENT 'Subtítulo / descrição',
  duracao       INT UNSIGNED    DEFAULT NULL COMMENT 'Duração em segundos (NULL = duração do vídeo)',
  transicao     ENUM('fade','none') NOT NULL DEFAULT 'fade',
  ativo         TINYINT(1)      NOT NULL DEFAULT 1,
  criado_em     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
                                ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_pi_playlist FOREIGN KEY (playlist_id)
    REFERENCES playlists(id) ON DELETE CASCADE,

  CONSTRAINT fk_pi_midia FOREIGN KEY (midia_id)
    REFERENCES midias(id) ON DELETE CASCADE,

  -- Ordem única por playlist
  UNIQUE KEY uq_playlist_ordem (playlist_id, ordem)
) ENGINE=InnoDB;


-- ============================================================
--  TABELA: terminais
--  Registra os computadores/TVs que acessam o sistema
-- ============================================================
CREATE TABLE IF NOT EXISTS terminais (
  id            INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
  nome          VARCHAR(100)    NOT NULL COMMENT 'Ex: TV Recepção, TV Sala de Espera',
  ip_address    VARCHAR(45)     DEFAULT NULL COMMENT 'IPv4 ou IPv6',
  playlist_id   INT UNSIGNED    NOT NULL DEFAULT 1 COMMENT 'Qual playlist este terminal exibe',
  ultimo_acesso DATETIME        DEFAULT NULL,
  ativo         TINYINT(1)      NOT NULL DEFAULT 1,
  criado_em     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_term_playlist FOREIGN KEY (playlist_id)
    REFERENCES playlists(id) ON DELETE RESTRICT
) ENGINE=InnoDB;


-- ============================================================
--  TABELA: logs_exibicao  (opcional — auditoria)
--  Registra cada vez que um item foi exibido em um terminal
-- ============================================================
CREATE TABLE IF NOT EXISTS logs_exibicao (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  terminal_id   INT UNSIGNED    DEFAULT NULL,
  playlist_item_id INT UNSIGNED DEFAULT NULL,
  exibido_em    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_log_terminal  (terminal_id),
  INDEX idx_log_item      (playlist_item_id),
  INDEX idx_log_data      (exibido_em),

  CONSTRAINT fk_log_terminal FOREIGN KEY (terminal_id)
    REFERENCES terminais(id) ON DELETE SET NULL,
  CONSTRAINT fk_log_item FOREIGN KEY (playlist_item_id)
    REFERENCES playlist_itens(id) ON DELETE SET NULL
) ENGINE=InnoDB;


-- ============================================================
--  ÍNDICES adicionais para performance
-- ============================================================
CREATE INDEX idx_pi_playlist_ordem ON playlist_itens (playlist_id, ordem);
CREATE INDEX idx_midias_tipo        ON midias (tipo);


-- ============================================================
--  VIEW: vw_playlist_completa
--  Retorna os itens de uma playlist já com dados da mídia,
--  prontos para o frontend consumir via API
-- ============================================================
CREATE OR REPLACE VIEW vw_playlist_completa AS
SELECT
  pi.id               AS item_id,
  pi.playlist_id,
  p.nome              AS playlist_nome,
  p.loop_mode,
  p.default_duration,
  p.show_clock,
  pi.ordem,
  pi.titulo,
  pi.subtitulo,
  pi.duracao,
  pi.transicao,
  pi.ativo            AS item_ativo,
  m.id                AS midia_id,
  m.nome_arquivo,
  m.nome_salvo,
  m.tipo,
  m.mime_type,
  m.caminho
FROM playlist_itens pi
INNER JOIN playlists p ON p.id = pi.playlist_id
INNER JOIN midias    m ON m.id = pi.midia_id
WHERE pi.ativo = 1
  AND p.ativa  = 1
ORDER BY pi.playlist_id, pi.ordem;


-- ============================================================
--  STORED PROCEDURES úteis
-- ============================================================

DELIMITER $$

-- Reordena os itens de uma playlist após remoção/inserção
-- Chame após qualquer alteração de ordem
CREATE PROCEDURE sp_reordenar_playlist(IN p_playlist_id INT UNSIGNED)
BEGIN
  SET @row := -1;
  UPDATE playlist_itens
  SET ordem = (@row := @row + 1)
  WHERE playlist_id = p_playlist_id
    AND ativo = 1
  ORDER BY ordem;
END$$

-- Move um item para outra posição dentro da playlist
CREATE PROCEDURE sp_mover_item(
  IN p_item_id     INT UNSIGNED,
  IN p_nova_ordem  SMALLINT UNSIGNED
)
BEGIN
  DECLARE v_playlist_id INT UNSIGNED;
  DECLARE v_ordem_atual  SMALLINT UNSIGNED;

  SELECT playlist_id, ordem
    INTO v_playlist_id, v_ordem_atual
    FROM playlist_itens WHERE id = p_item_id;

  IF v_ordem_atual < p_nova_ordem THEN
    -- Move para baixo: sobe os itens intermediários
    UPDATE playlist_itens
    SET ordem = ordem - 1
    WHERE playlist_id = v_playlist_id
      AND ordem > v_ordem_atual
      AND ordem <= p_nova_ordem;
  ELSE
    -- Move para cima: desce os itens intermediários
    UPDATE playlist_itens
    SET ordem = ordem + 1
    WHERE playlist_id = v_playlist_id
      AND ordem >= p_nova_ordem
      AND ordem < v_ordem_atual;
  END IF;

  UPDATE playlist_itens SET ordem = p_nova_ordem WHERE id = p_item_id;
END$$

DELIMITER ;


-- ============================================================
--  USUÁRIO DE APLICAÇÃO (acesso restrito via rede)
--  Troque '192.168.1.%' pela sua faixa de IP local
-- ============================================================

-- Usuário para o servidor da aplicação (localhost)
CREATE USER IF NOT EXISTS 'tv_app'@'localhost'
  IDENTIFIED BY 'TrocaSenhaAqui!2024';

-- Usuário para acesso via rede interna
CREATE USER IF NOT EXISTS 'tv_app'@'192.168.1.%'
  IDENTIFIED BY 'TrocaSenhaAqui!2024';

GRANT SELECT, INSERT, UPDATE, DELETE
  ON tv_anuncios.*
  TO 'tv_app'@'localhost';

GRANT SELECT, INSERT, UPDATE, DELETE
  ON tv_anuncios.*
  TO 'tv_app'@'192.168.1.%';

FLUSH PRIVILEGES;


-- ============================================================
--  DADOS DE EXEMPLO (remova em produção)
-- ============================================================

-- Mídia de exemplo
INSERT INTO midias (nome_arquivo, nome_salvo, tipo, mime_type, tamanho_bytes, caminho) VALUES
  ('banner_verao.jpg',   'a1b2c3_banner_verao.jpg',   'image', 'image/jpeg', 204800,  'uploads/a1b2c3_banner_verao.jpg'),
  ('promo_natal.png',    'b2c3d4_promo_natal.png',    'image', 'image/png',  512000,  'uploads/b2c3d4_promo_natal.png'),
  ('institucional.mp4',  'c3d4e5_institucional.mp4',  'video', 'video/mp4',  10485760,'uploads/c3d4e5_institucional.mp4');

-- Itens na playlist principal
INSERT INTO playlist_itens (playlist_id, midia_id, ordem, titulo, subtitulo, duracao, transicao) VALUES
  (1, 1, 0, 'Promoção de Verão',  'Só hoje! Aproveite os descontos', 10, 'fade'),
  (1, 2, 1, 'Feliz Natal!',       'De toda a equipe para você',       15, 'fade'),
  (1, 3, 2, NULL,                 NULL,                               NULL, 'fade');

-- Terminal de exemplo
INSERT INTO terminais (nome, ip_address, playlist_id) VALUES
  ('TV Recepção',      '192.168.1.101', 1),
  ('TV Sala de Espera','192.168.1.102', 1);
