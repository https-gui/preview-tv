# 📺 Sistema de Exibição e Gerenciamento de Anúncios | Digital Signage System

**PT-BR · English**

Sistema web para gerenciamento e exibição automatizada de conteúdos digitais em televisores, monitores e painéis de sinalização digital. Permite organizar imagens e vídeos, criar playlists e reproduzir anúncios automaticamente em tela cheia.

A solução foi desenvolvida para simplificar a administração de conteúdos exibidos em diferentes ambientes, centralizando a configuração e a organização das mídias em uma interface web.

🌐 **Site / Website:** [Acesse o sistema](https://viewclock.vercel.app)

---

# 🇧🇷 Português Brasileiro

## 🖥️ Conheça o Sistema

O sistema permite gerenciar os conteúdos que serão exibidos em uma ou mais telas compatíveis com o ambiente configurado. O administrador organiza as mídias por meio do painel web, enquanto o dispositivo de exibição apresenta os conteúdos conforme a sequência e as configurações definidas.

<p align="center">
  <img src="https://github.com/user-attachments/assets/a68a9f23-31a6-4615-88af-c6474023809a" alt="Visão geral do sistema de gerenciamento e exibição de anúncios" width="100%">
</p>

A interface reúne os recursos de gerenciamento e acompanhamento da reprodução. Dessa forma, o administrador consegue organizar os conteúdos e preparar a apresentação sem precisar editar manualmente cada tela de exibição.

## ⚙️ Como Funciona na Prática

### 1. Gerenciamento dos Conteúdos

O primeiro passo é adicionar as imagens e os vídeos que serão exibidos. O sistema oferece suporte aos formatos JPG, PNG, GIF e WEBP para imagens, além de MP4, WEBM, OGV e MOV para vídeos.

Os arquivos cadastrados podem ser organizados para utilização nas playlists, permitindo manter os materiais de divulgação centralizados.

<p align="center">
  <img src="https://github.com/user-attachments/assets/0837fb31-4244-4c15-919f-46221b8d25cb" alt="Interface do sistema de exibição e gerenciamento de conteúdos digitais" width="100%">
</p>

### 2. Organização das Playlists

Após adicionar as mídias, o administrador organiza a sequência em que os conteúdos serão apresentados. A ordem pode ser alterada por meio de arrastar e soltar, facilitando a atualização da programação.

Também é possível configurar opções disponíveis para cada conteúdo, como títulos, subtítulos, duração de exibição e efeitos de transição.

Essa etapa permite preparar uma sequência de anúncios de acordo com a necessidade do estabelecimento ou ambiente de exibição.

### 3. Reprodução dos Anúncios

Com a playlist configurada, o sistema pode iniciar a reprodução na tela de destino. Os conteúdos são apresentados automaticamente, respeitando a ordem e as opções definidas pelo administrador.

O modo de tela cheia foi pensado para televisores, monitores e painéis digitais, reduzindo a interferência de elementos da interface do navegador durante a apresentação.

<p align="center">
  <img src="https://github.com/user-attachments/assets/c4b9bb90-0eac-4605-8fc9-b6c163412723" alt="Exemplo adicional da interface do sistema de anúncios digitais" width="750">
</p>

### 4. Acompanhamento da Exibição

Durante a reprodução, o sistema pode apresentar indicadores visuais, como relógio, barra de progresso e contador de conteúdos. Esses recursos ajudam a acompanhar a sequência de exibição e o andamento da playlist.

A reprodução contínua, com possibilidade de repetição da playlist, é útil para ambientes em que os anúncios precisam permanecer visíveis ao longo do expediente.

## 🚀 Principais Funcionalidades

- **Gerenciamento de mídias:** envio de imagens e vídeos em formatos compatíveis.
- **Criação de playlists:** organização dos conteúdos em sequências de reprodução.
- **Reordenação por arrastar e soltar:** alteração da ordem dos anúncios de forma prática.
- **Personalização dos conteúdos:** configuração de títulos, subtítulos, duração e transições.
- **Reprodução automática:** apresentação contínua de imagens e vídeos.
- **Repetição da playlist:** reinício da sequência após a conclusão dos conteúdos.
- **Modo de tela cheia:** interface destinada a telas de exibição.
- **Relógio e indicadores:** visualização do horário, do progresso e do contador de conteúdos.
- **Painel administrativo:** centralização do gerenciamento dos anúncios.
- **Persistência de dados:** armazenamento das informações por meio de API e banco de dados.
- **Diagnóstico:** verificação da comunicação com a API e do carregamento de imagens, incluindo testes voltados a navegadores LG webOS.

## 🎯 Onde Pode Ser Utilizado?

O sistema pode ser aplicado em diferentes ambientes que necessitam de exibição organizada de conteúdos digitais:

- Lojas e estabelecimentos comerciais.
- Recepções e salas de espera.
- Empresas e escritórios.
- Academias e centros de treinamento.
- Escolas e instituições.
- Televisores e painéis de sinalização digital.

## 🛠️ Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript
- PHP para a API
- MySQL ou MariaDB
- API para comunicação entre a interface web e o banco de dados

## 🗄️ Banco de Dados

O banco de dados possui estruturas destinadas ao gerenciamento de playlists, mídias, itens de playlists, terminais de exibição e registros de reprodução.

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
- Navegador compatível com os recursos utilizados.
- Conectividade de rede entre o painel administrativo, a API e os dispositivos de exibição.
- Permissões adequadas para envio e armazenamento de arquivos.

## 🔧 Instalação e Configuração

1. Configure um servidor web compatível com PHP.
2. Crie o banco de dados e importe o arquivo `tv_anuncios.sql`.
3. Configure as credenciais do banco de dados no ambiente do servidor.
4. Ajuste o endereço da API nos arquivos JavaScript.
5. Verifique as permissões de envio e armazenamento das mídias.
6. Utilize `diagnostico.html` para testar a comunicação com a API e o carregamento das imagens.
7. Teste a reprodução nos navegadores e dispositivos de destino.

**Importante:** não publique senhas, tokens, credenciais reais ou endereços internos de servidores em um repositório público. Utilize configurações próprias para cada ambiente antes de colocar o sistema em produção.

## 💖 Apoie o Projeto

Se este projeto foi útil para você e deseja contribuir para seu desenvolvimento e aprimoramento, considere fazer uma doação voluntária pelo PayPal.

**[❤️ Fazer uma doação via PayPal](https://www.paypal.com/donate/?hosted_button_id=557HUPNMHMMHW)**

Toda contribuição é bem-vinda e ajuda a incentivar a continuidade do projeto.

---

# 🇺🇸 English

## 🖥️ System Overview

This web-based system allows administrators to manage the content displayed on compatible screens and digital signage devices. Media is organized through a web interface, while the playback display presents content according to the configured sequence and settings.

<p align="center">
  <img src="https://github.com/user-attachments/assets/a68a9f23-31a6-4615-88af-c6474023809a" alt="Overview of the digital signage and advertisement management system" width="100%">
</p>

The interface brings together media management and playback-related tools, making it easier to organize content and prepare presentations without manually editing each display.

## ⚙️ How It Works

### 1. Manage Media Content

The first step is to add the images and videos that will be displayed. Supported image formats include JPG, PNG, GIF, and WEBP. Supported video formats include MP4, WEBM, OGV, and MOV.

Uploaded media can be organized for use in playlists, keeping promotional materials in one place.

<p align="center">
  <img src="https://github.com/user-attachments/assets/0837fb31-4244-4c15-919f-46221b8d25cb" alt="Digital content management interface" width="100%">
</p>

### 2. Organize Playlists

After uploading media, the administrator arranges the order in which content will appear. Items can be reordered using drag and drop.

Available settings may include titles, subtitles, display duration, and transition effects.

This makes it easier to prepare a content sequence tailored to a business or display environment.

### 3. Play Advertisements

Once a playlist is configured, playback can be started on the target display. Content is presented automatically according to the selected order and settings.

Full-screen mode is designed for TVs, monitors, and digital signage screens, helping keep the presentation focused on the displayed content.

<p align="center">
  <img src="https://github.com/user-attachments/assets/c4b9bb90-0eac-4605-8fc9-b6c163412723" alt="Additional view of the digital signage system" width="750">
</p>

### 4. Monitor Playback

During playback, the system can display visual indicators such as a clock, progress bar, and content counter. These elements help users follow the playlist and monitor playback progress.

Continuous playback and playlist looping are useful for environments where advertisements need to remain visible throughout business hours.

## 🚀 Key Features

- **Media management:** Upload images and videos in supported formats.
- **Playlist creation:** Organize content into playback sequences.
- **Drag-and-drop reordering:** Easily change advertisement order.
- **Content customization:** Configure titles, subtitles, duration, and transitions.
- **Automatic playback:** Continuously display images and videos.
- **Playlist looping:** Repeat the sequence after the content finishes.
- **Full-screen mode:** Dedicated display interface.
- **Clock and playback indicators:** Show the time, progress, and content counter.
- **Administrative dashboard:** Manage advertisements centrally.
- **Data persistence:** Store information through an API and database.
- **Diagnostic tool:** Check API connectivity and image loading, including tests for LG webOS browsers.

## 🎯 Use Cases

The system can be used in environments that need organized digital content presentation, including:

- Retail stores and commercial establishments.
- Reception areas and waiting rooms.
- Businesses and offices.
- Gyms and fitness centers.
- Schools and educational institutions.
- TVs and digital signage displays.

## 🛠️ Technologies

- HTML5
- CSS3
- JavaScript
- PHP for the API
- MySQL or MariaDB
- API integration for database communication

## 🗄️ Database

The database includes structures for managing playlists, media files, playlist items, display terminals, and playback records.

Main tables:

- `playlists` — stores playlist information.
- `midias` — stores image and video metadata.
- `playlist_itens` — associates media with playlists and defines playback order.
- `terminais` — stores display device information.
- `logs_exibicao` — stores records related to content playback.

The `tv_anuncios.sql` file contains the SQL database structure.

## 📋 Requirements

- A web server compatible with PHP.
- MySQL or MariaDB.
- An API configured to communicate with the database.
- A browser compatible with the system's features.
- Network connectivity between the administrative dashboard, API, and display devices.
- Appropriate media upload and storage permissions.

## 🔧 Installation and Setup

1. Set up a web server with PHP support.
2. Create the database and import `tv_anuncios.sql`.
3. Configure database credentials on the server.
4. Update the API address in the JavaScript files.
5. Verify media upload and storage permissions.
6. Use `diagnostico.html` to test API connectivity and image loading.
7. Test playback in the target browsers and display devices.

**Important:** Do not publish passwords, tokens, real credentials, or internal server addresses in a public repository. Use environment-specific settings before deploying the system to production.

## 💖 Support the Project

If you find this project useful and would like to support its continued development, consider making a voluntary PayPal donation.

**[❤️ Donate via PayPal](https://www.paypal.com/donate/?hosted_button_id=557HUPNMHMMHW)**

Every contribution is appreciated and helps encourage the continued development of this project.

---

Developed with a focus on usability, organization, and automated digital content display.

*Desenvolvido com foco na praticidade, organização e automação da exibição de conteúdos digitais.*
