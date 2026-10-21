<?php
// =============================================================
//  video-converter.php
//  Inclua este arquivo no seu api.php existente
//  e chame convertVideoForWebOS() após salvar o upload.
//
//  Requisito: ffmpeg instalado no servidor
//    Ubuntu/Debian: sudo apt install ffmpeg
// =============================================================

/**
 * Converte um vídeo para H.264 Baseline 3.1 compatível com
 * Chrome 79 / LG WebOS e move o moov atom para o início (faststart).
 *
 * @param  string $inputPath   Caminho absoluto do arquivo recém-salvo
 * @return array               ['success' => bool, 'message' => string, 'path' => string]
 */
function convertVideoForWebOS(string $inputPath): array
{
    // Verifica se ffmpeg está disponível
    exec('which ffmpeg 2>/dev/null', $out, $rc);
    if ($rc !== 0) {
        return ['success' => false, 'message' => 'ffmpeg não encontrado no servidor.', 'path' => $inputPath];
    }

    if (!file_exists($inputPath)) {
        return ['success' => false, 'message' => 'Arquivo não encontrado: ' . $inputPath, 'path' => $inputPath];
    }

    $dir      = dirname($inputPath);
    $name     = pathinfo($inputPath, PATHINFO_FILENAME);
    $tmpPath  = $dir . '/' . $name . '_webos_tmp.mp4';
    $finalPath = $dir . '/' . $name . '.mp4'; // sempre salva como .mp4

    // Comando FFmpeg:
    //   -profile:v baseline -level:v 3.1  → compatibilidade Chrome 79/WebOS
    //   -movflags +faststart               → moov atom no início (streaming)
    //   -vf scale...                       → garante dimensões pares (exigido H.264)
    //   -preset slow -crf 23               → qualidade boa com tamanho razoável
    $cmd = implode(' ', [
        'ffmpeg',
        '-i ' . escapeshellarg($inputPath),
        '-c:v libx264',
        '-profile:v baseline',
        '-level:v 3.1',
        '-preset slow',
        '-crf 23',
        "-vf \"scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2\"",
        '-c:a aac',
        '-b:a 128k',
        '-ac 2',
        '-movflags +faststart',
        '-y',
        escapeshellarg($tmpPath),
        '2>&1',
    ]);

    exec($cmd, $output, $returnCode);

    if ($returnCode !== 0 || !file_exists($tmpPath)) {
        // Loga o erro mas não apaga o original
        $log = implode("\n", array_slice($output, -10)); // últimas 10 linhas
        error_log("[convertVideoForWebOS] ERRO ao converter {$inputPath}:\n{$log}");
        return [
            'success' => false,
            'message' => 'Falha na conversão FFmpeg. Vídeo original mantido.',
            'path'    => $inputPath,
        ];
    }

    // Substitui o original pelo convertido
    if ($inputPath !== $finalPath) {
        @unlink($inputPath); // remove original se extensão era diferente (.mov etc)
    }
    rename($tmpPath, $finalPath);

    return [
        'success' => true,
        'message' => 'Vídeo convertido com sucesso para H.264 Baseline (WebOS).',
        'path'    => $finalPath,
    ];
}

/**
 * Verifica se um arquivo é vídeo pela extensão.
 */
function isVideoFile(string $filename): bool
{
    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    return in_array($ext, ['mp4', 'mov', 'webm', 'avi', 'mkv', 'm4v'], true);
}


// =============================================================
//  EXEMPLO DE INTEGRAÇÃO NO SEU api.php
//  Substitua o bloco de upload existente por este:
// =============================================================
/*

// --- Trecho a adicionar no seu case/action de upload ---

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {

    $uploadDir  = __DIR__ . '/uploads/';
    $tmpName    = $_FILES['file']['tmp_name'];
    $origName   = basename($_FILES['file']['name']);
    $safeName   = preg_replace('/[^a-zA-Z0-9_\-\.]/', '_', $origName);
    $destPath   = $uploadDir . uniqid() . '_' . $safeName;

    if (!move_uploaded_file($tmpName, $destPath)) {
        http_response_code(500);
        echo json_encode(['error' => 'Falha ao salvar arquivo.']);
        exit;
    }

    $finalPath = $destPath;

    // Converte automaticamente se for vídeo
    if (isVideoFile($origName)) {
        $result = convertVideoForWebOS($destPath);
        $finalPath = $result['path'];

        if (!$result['success']) {
            // Conversão falhou mas o upload original ainda está lá
            // Pode logar ou retornar aviso — não bloqueia o upload
            error_log('[Upload] Aviso conversão: ' . $result['message']);
        }
    }

    // Salva $finalPath no banco normalmente...
    $url = 'http://10.181.0.29:8085/uploads/' . basename($finalPath);
    echo json_encode(['success' => true, 'url' => $url]);
    exit;
}

*/
