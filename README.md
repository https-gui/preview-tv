# 📺 Sistema de Exibição e Gerenciamento de Anúncios

Sistema web para gerenciamento e exibição automatizada de imagens e vídeos em telas, televisores e painéis digitais. Desenvolvido para facilitar a organização de conteúdos e sua reprodução em modo de tela cheia.

## 🚀 Funcionalidades

- **Gerenciamento de mídias:** envio de imagens nos formatos JPG, PNG, GIF e WEBP, além de vídeos MP4, WEBM, OGV e MOV.
- **Criação de playlists:** organização dos conteúdos que serão exibidos na tela.
- **Reordenação de mídias:** alteração da sequência de exibição por meio de arrastar e soltar.
- **Personalização dos conteúdos:** configuração de títulos, subtítulos, duração e transições.
- **Reprodução automática:** exibição contínua de imagens e vídeos, com suporte a repetição da playlist.
- **Modo tela cheia:** reprodução dos anúncios em uma interface própria para televisores e painéis digitais.
- **Relógio e indicadores:** exibição de horário, barra de progresso e contador de conteúdos.
- **Painel administrativo:** interface para gerenciar os anúncios e controlar a reprodução.
- **Persistência de dados:** integração com uma API e banco de dados para armazenar as informações das mídias e playlists.
- **Diagnóstico:** página para auxiliar na verificação da conexão com a API e no carregamento de imagens, incluindo testes voltados ao navegador LG webOS.

## 🛠️ Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- PHP para a API
- MySQL ou MariaDB
- API para comunicação entre o painel web e o banco de dados

## ⚙️ Como funciona

1. O administrador acessa o painel de gerenciamento.
2. Adiciona imagens e vídeos ao sistema.
3. Organiza a ordem de exibição e configura as opções de cada conteúdo.
4. Inicia a reprodução na tela de destino.
5. O sistema apresenta os conteúdos automaticamente, seguindo a sequência e as configurações definidas.

## 🗄️ Banco de dados

O banco de dados contém estruturas destinadas ao gerenciamento das playlists, mídias, itens de cada playlist, terminais e registros de exibição.

Principais tabelas:

- `playlists` — cadastro das playlists.
- `midias` — informações das imagens e dos vídeos.
- `playlist_itens` — associação e ordenação das mídias nas playlists.
- `terminais` — cadastro dos dispositivos de exibição.
- `logs_exibicao` — registros relacionados à reprodução dos conteúdos.

O arquivo `tv_anuncios.sql` contém a estrutura SQL do banco de dados.

## 📋 Requisitos

- Servidor web compatível com PHP.
- MySQL ou MariaDB.
- API configurada para comunicação com o banco de dados.
- Navegador moderno compatível com os recursos utilizados pelo sistema.
- Conexão de rede entre o painel administrativo, a API e os dispositivos de exibição.

## 🔧 Configuração

Antes de executar o projeto:

1. Configure o banco de dados utilizando o arquivo `tv_anuncios.sql`.
2. Ajuste o endereço da API no JavaScript para apontar para o servidor correto.
3. Configure as credenciais de acesso ao banco de dados no ambiente do servidor.
4. Verifique as permissões de envio e armazenamento de arquivos.
5. Teste o funcionamento utilizando a página `diagnostico.html`.

**Importante:** não publique senhas, credenciais reais ou endereços internos de servidores no repositório. Utilize configurações próprias para cada ambiente e altere quaisquer senhas de exemplo antes de colocar o sistema em produção.

## 💖 Apoie o projeto

Se este projeto foi útil para você e deseja contribuir para seu desenvolvimento e aprimoramento, considere fazer uma doação pelo PayPal.

**[❤️ Fazer uma doação via PayPal](https://www.paypal.com/donate/?hosted_button_id=557HUPNMHMMHW)**

Toda contribuição é bem-vinda e ajuda a incentivar a continuidade do projeto.

## 📄 Licença

Defina uma licença para o projeto antes de permitir formalmente seu uso, modificação e redistribuição. Você pode adicionar um arquivo `LICENSE` à raiz do repositório.

---

Desenvolvido com foco na praticidade, organização e automação da exibição de conteúdos digitais.
