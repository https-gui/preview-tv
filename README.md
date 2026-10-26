# 📺 Sistema de Exibição e Gerenciamento de Anúncios | Digital Signage System

**PT-BR · English**

Um sistema web para gerenciamento e reprodução automatizada de conteúdos digitais em televisores, monitores e painéis de sinalização digital. Desenvolvido para facilitar a organização de imagens e vídeos, a criação de playlists e a exibição contínua de anúncios em tela cheia.

A solução conta com painel administrativo, personalização dos conteúdos, controle da sequência de reprodução e integração com API e banco de dados.

🌎 **Idioma / Language:** Português Brasileiro e English

---

## 🖥️ Demonstração do Sistema | Live System Preview

Veja o sistema em funcionamento por meio da captura de tela abaixo.

<p align="center">
  <img src="https://github.com/user-attachments/assets/a68a9f23-31a6-4615-88af-c6474023809a" alt="Captura de tela do sistema de gerenciamento e exibição de anúncios em funcionamento" width="100%">
</p>

---

# 🇧🇷 Português Brasileiro

## 🚀 Funcionalidades

- **Gerenciamento de mídias:** envio e organização de imagens nos formatos JPG, PNG, GIF e WEBP, além de vídeos MP4, WEBM, OGV e MOV.
- **Gerenciamento de playlists:** criação e organização de listas de reprodução de conteúdos.
- **Ordenação por arrastar e soltar:** reorganização prática da sequência de exibição das mídias.
- **Personalização de conteúdos:** configuração de títulos, subtítulos, duração de exibição e efeitos de transição.
- **Reprodução automatizada:** exibição contínua de imagens e vídeos, com suporte à repetição da playlist.
- **Modo de tela cheia:** interface dedicada à exibição de anúncios em televisores, monitores e painéis digitais.
- **Relógio e indicadores:** exibição do horário atual, barra de progresso e contador de conteúdos.
- **Painel administrativo:** gerenciamento centralizado das mídias, playlists e opções de reprodução.
- **Persistência de dados:** integração com API e banco de dados para armazenar informações das mídias e playlists.
- **Ferramenta de diagnóstico:** página para verificar a comunicação com a API e o carregamento de imagens, incluindo testes voltados a navegadores de dispositivos LG webOS.

## 🛠️ Tecnologias Utilizadas

- HTML5 — estrutura das páginas.
- CSS3 — estilos e layout da interface.
- JavaScript — interatividade, gerenciamento de mídias e controle de reprodução.
- PHP — implementação da API no servidor.
- MySQL ou MariaDB — armazenamento persistente dos dados.
- API — comunicação entre a interface web, o servidor e o banco de dados.

## ⚙️ Como Funciona

1. O administrador acessa o painel de gerenciamento.
2. Adiciona as imagens e os vídeos que serão exibidos.
3. Organiza os conteúdos em playlists e define a sequência de reprodução.
4. Configura as opções disponíveis, como títulos, duração e transições.
5. Inicia a reprodução no dispositivo de destino.
6. O sistema apresenta os conteúdos automaticamente, conforme a ordem e as configurações definidas.

## 🗄️ Estrutura do Banco de Dados

O banco de dados possui estruturas destinadas ao gerenciamento de playlists, mídias, itens de cada playlist, terminais de exibição e registros de reprodução.

Principais tabelas:

- `playlists` — armazena as informações das playlists.
- `midias` — registra informações das imagens e dos vídeos.
- `playlist_itens` — relaciona as mídias às playlists e define sua ordem de exibição.
- `terminais` — armazena informações dos dispositivos de exibição.
- `logs_exibicao` — registra informações relacionadas à reprodução dos conteúdos.

O arquivo `tv_anuncios.sql` contém a estrutura SQL do banco de dados.

## 📋 Requisitos

- Servidor web compatível com PHP.
- MySQL ou MariaDB.
- API configurada para comunicação com o banco de dados.
- Navegador moderno compatível com os recursos utilizados pelo sistema.
- Conectividade de rede entre o painel administrativo, a API e os dispositivos de exibição.
- Permissões adequadas para envio e armazenamento de arquivos de mídia.

## 🔧 Instalação e Configuração

1. Configure o ambiente com um servidor web compatível com PHP.
2. Crie o banco de dados e importe a estrutura do arquivo `tv_anuncios.sql`.
3. Configure as credenciais de acesso ao banco de dados no ambiente do servidor.
4. Atualize o endereço da API nos arquivos JavaScript para apontar para o servidor correto.
5. Verifique as permissões necessárias para o envio e o armazenamento das mídias.
6. Teste a comunicação com a API e o carregamento dos conteúdos usando a página `diagnostico.html`.
7. Valide a reprodução no navegador e nos dispositivos que serão utilizados para exibição.

**Importante — Segurança:** não publique senhas, credenciais reais, tokens ou endereços internos de servidores em um repositório público. Utilize configurações específicas para cada ambiente e substitua quaisquer credenciais de exemplo antes de disponibilizar o sistema em produção.

## 🎯 Aplicações

O sistema pode ser utilizado em diferentes ambientes, como:

- Lojas e estabelecimentos comerciais.
- Recepções e salas de espera.
- Empresas e escritórios.
- Academias e centros de treinamento.
- Escolas e instituições.
- Televisores e painéis de sinalização digital.

## 💖 Apoie o Projeto

Se este projeto foi útil para você e deseja contribuir para seu desenvolvimento e aprimoramento, considere fazer uma doação voluntária pelo PayPal.

**[❤️ Fazer uma doação via PayPal](https://www.paypal.com/donate/?hosted_button_id=557HUPNMHMMHW)**

Toda contribuição é bem-vinda e ajuda a incentivar a continuidade do projeto.

---

# 🇺🇸 English

## 📺 Digital Signage & Advertisement Display System

A web-based system for managing and automatically displaying digital content on TVs, monitors, and digital signage screens. It provides tools to organize images and videos, create playlists, customize content, and run continuous full-screen presentations.

The solution includes an administrative dashboard, playback controls, and API and database integration for persistent media and playlist management.

## 🚀 Features

- **Media management:** Upload and organize images in JPG, PNG, GIF, and WEBP formats, along with videos in MP4, WEBM, OGV, and MOV formats.
- **Playlist management:** Create and organize playlists for digital content.
- **Drag-and-drop reordering:** Easily change the playback sequence by dragging and dropping media items.
- **Content customization:** Configure titles, subtitles, display duration, and transition effects.
- **Automated playback:** Continuously display images and videos, with playlist looping support.
- **Full-screen mode:** Dedicated playback interface for TVs, monitors, and digital signage displays.
- **Clock and playback indicators:** Display the current time, a progress bar, and a content counter.
- **Administrative dashboard:** Manage media, playlists, and playback settings in one place.
- **Data persistence:** Integrate with an API and database to store media and playlist information.
- **Diagnostic tool:** Check API connectivity and image loading, including diagnostic tests designed for LG webOS browsers.

## 🛠️ Technologies

- HTML5 — page structure.
- CSS3 — styling and layout.
- JavaScript — interactivity, media management, and playback control.
- PHP — server-side API implementation.
- MySQL or MariaDB — persistent data storage.
- API integration — communication between the web interface, server, and database.

## ⚙️ How It Works

1. The administrator opens the management dashboard.
2. Images and videos are uploaded to the system.
3. Media items are organized into playlists and arranged in the desired playback order.
4. Available settings, including titles, duration, and transitions, are configured.
5. Playback is started on the target device.
6. The system automatically displays the content according to the configured sequence and settings.

## 🗄️ Database Structure

The database contains structures for managing playlists, media files, playlist items, display terminals, and playback records.

Main tables:

- `playlists` — stores playlist information.
- `midias` — stores image and video metadata.
- `playlist_itens` — associates media with playlists and defines playback order.
- `terminais` — stores information about display devices.
- `logs_exibicao` — stores records related to content playback.

The `tv_anuncios.sql` file contains the SQL database structure.

## 📋 Requirements

- A web server compatible with PHP.
- MySQL or MariaDB.
- An API configured to communicate with the database.
- A modern browser compatible with the system's features.
- Network connectivity between the administrative dashboard, API, and display devices.
- Appropriate permissions for uploading and storing media files.

## 🔧 Installation and Setup

1. Set up a web server with PHP support.
2. Create the database and import the `tv_anuncios.sql` file.
3. Configure database credentials on the server.
4. Update the API address in the JavaScript files to point to the correct server.
5. Verify the permissions required for media uploads and storage.
6. Test API connectivity and image loading using `diagnostico.html`.
7. Validate playback in the target browser and display devices.

**Important — Security:** Do not publish passwords, real credentials, tokens, or internal server addresses in a public repository. Use environment-specific configuration and replace any example credentials before deploying the system to production.

## 🎯 Use Cases

The system can be used in a variety of environments, including:

- Retail stores and commercial establishments.
- Reception areas and waiting rooms.
- Businesses and offices.
- Gyms and fitness centers.
- Schools and educational institutions.
- TVs and digital signage displays.

## 💖 Support the Project

If you find this project useful and would like to support its development and improvement, consider making a voluntary donation through PayPal.

**[❤️ Donate via PayPal](https://www.paypal.com/donate/?hosted_button_id=557HUPNMHMMHW)**

Every contribution is appreciated and helps encourage the continued development of this project.

---

Developed with a focus on usability, organization, and automated digital content display.

*Desenvolvido com foco na praticidade, organização e automação da exibição de conteúdos digitais.*
