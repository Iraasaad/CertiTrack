<?php
header("Content-Type: text/plain");
error_reporting(E_ALL);

ini_set('display_errors', 0);
error_reporting(0);
$uploadsDir = __DIR__ . '/uploads/';

echo "Checking uploads directory...\n";
echo "Directory path: " . $uploadsDir . "\n\n";

if (file_exists($uploadsDir)) {
    echo "✓ Directory exists\n";
} else {
    echo "✗ Directory does not exist\n";
    echo "Attempting to create directory...\n";
    
    if (mkdir($uploadsDir, 0755, true)) {
        echo "✓ Directory created successfully\n";
    } else {
        echo "✗ Failed to create directory\n";
        echo "Error: " . error_get_last()['message'] . "\n";
    }
}

if (is_writable($uploadsDir)) {
    echo "✓ Directory is writable\n";
} else {
    echo "✗ Directory is not writable\n";
    echo "Current permissions: " . substr(sprintf('%o', fileperms($uploadsDir)), -4) . "\n";
    echo "Attempting to make directory writable...\n";
    
    if (chmod($uploadsDir, 0755)) {
        echo "✓ Permissions updated successfully\n";
    } else {
        echo "✗ Failed to update permissions\n";
        echo "Error: " . error_get_last()['message'] . "\n";
    }
}

echo "\nFiles in the uploads directory:\n";
if ($handle = opendir($uploadsDir)) {
    $fileCount = 0;
    while (false !== ($entry = readdir($handle))) {
        if ($entry != "." && $entry != "..") {
            $fileCount++;
            $filePath = $uploadsDir . $entry;
            echo "- " . $entry . " (" . filesize($filePath) . " bytes)\n";
        }
    }
    closedir($handle);
    
    if ($fileCount === 0) {
        echo "No files found in the directory\n";
    }
} else {
    echo "Could not open directory for reading\n";
}

echo "\nTesting write permissions by creating a test file...\n";
$testFile = $uploadsDir . 'test_' . time() . '.txt';
if (file_put_contents($testFile, 'This is a test file to verify write permissions.')) {
    echo "✓ Test file created successfully\n";
    
    if (unlink($testFile)) {
        echo "✓ Test file removed successfully\n";
    } else {
        echo "✗ Failed to remove test file\n";
    }
} else {
    echo "✗ Failed to create test file\n";
    echo "Error: " . error_get_last()['message'] . "\n";
}

echo "\nDirectory check completed\n";
?>

