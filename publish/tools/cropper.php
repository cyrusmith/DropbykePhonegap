<?php
/**
 * Search specified folder recursive and removes files by mask.
 * Typical usage is to remove .php scripts from image folder.
 */

define('DS', DIRECTORY_SEPARATOR);
require_once 'Processor.php';

if (count($argv) < 4) {
    exit - 1;
}


echo "Begin\n";

$rootPath = $argv[1];
$destPath = $argv[2];
$srcImg = $argv[3];

if (!file_exists($rootPath)) exit - 1;

$proc = new Processor($rootPath, new IconVisitor($srcImg, $destPath));
$proc->process();

class IconVisitor
{

    private $srcImg;
    private $destPath;

    private $srcWidth;
    private $srcHeight;

    public function __construct($srcIcon, $path)
    {
        $this->destPath = $path;

        if (!file_exists($this->destPath)) {
            mkdir($this->destPath);
        }

        $this->srcImg = imagecreatefrompng($srcIcon);

        list($this->srcWidth, $this->srcHeight) = getimagesize($srcIcon);
		
		echo "[$this->srcWidth, $this->srcHeight]\n";
    }

    public function visit($path, $file)
    {

        echo $path, " ", $file, "\n";

        if (!file_exists($file)) return;

        list($width, $height) = getimagesize($file);
        if (!$width || !$height) return;

        $imageP = imagecreatetruecolor($width, $height);
		
		imagecolortransparent($imageP, imagecolorallocatealpha($imageP, 0, 0, 0, 127));
		imagealphablending($imageP, false);
		imagesavealpha($imageP, true);		
		
		$copyHeight = $this->srcHeight;
		$copyWidth = $width*$this->srcHeight/$height;
		
		if($copyWidth > $this->srcWidth) {
			$copyHeight = $copyHeight*$this->srcWidth/$copyWidth;
			$copyWidth = $this->srcWidth;
		}
	
        imagecopyresampled($imageP, $this->srcImg, 0, 0, ($this->srcWidth - $copyWidth)/2, ($this->srcHeight - $copyHeight)/2, $width, $height, $copyWidth, $copyHeight);

        if (!file_exists($this->destPath . $path)) {
            mkdir($this->destPath . $path);
        }

		$pathInfo = pathinfo($file);
		
        imagepng($imageP, $this->destPath . $path . DS . $pathInfo["basename"], 9);
    }

}