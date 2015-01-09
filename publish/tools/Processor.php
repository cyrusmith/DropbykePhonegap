<?php

class Processor
{

    private $visitor;
    private $path;

    public function __construct($path, $visitor)
    {
        if (empty($visitor)) throw new Exception("Illegal argument:visitor not provided.");
        $this->visitor = $visitor;
        $this->path = $path;
    }

    public function process()
    {
        $this->doProcess($this->path);
    }

    private function doProcess($path)
    {
        $dirs = array();

        if ($handle = opendir($path)) {

            while (false !== ($entry = readdir($handle))) {
                if ($entry == "." || $entry == "..") {
                    continue;
                }
                $entryPath = $path . DS . $entry;
				
                if (is_file($entryPath)) {
                    $this->visitor->visit(str_replace($this->path, '', $path), $entryPath);

                } else if (is_dir($entryPath)) {
                    $dirs[] = $entryPath;
                }
            }
            closedir($handle);
        }

        foreach ($dirs as $dirPath) {
            $this->doProcess($dirPath);
        }
    }

}
