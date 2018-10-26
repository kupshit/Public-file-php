<?php
header('Content-Type: text/html; charset=utf-8');
$host = $_SERVER['HTTP_HOST'];
setlocale(LC_TIME, "vi_VN");
date_default_timezone_set('Asia/Ho_Chi_Minh');

$startdir = '.';
$showthumbnails = false; 
$showdirs = true;
$forcedownloads = false;
$hide = array(
				'dlf',
				'public_html',				
				'index.php',
				'Thumbs',
				'.htaccess',
				'.htpasswd'
			);
$displayindex = false;
$allowuploads = false;
$overwrite = false;

$indexfiles = array (
				'index.html',
				'index.htm',
				'default.htm',
				'default.html'
			);
			
$filetypes = array (
				'css' => 'CSS',
				'png' => 'PNG',
				'jpeg' => 'JPEG',
				'bmp' => 'BMP',
				'jpg' => 'JPG', 
				'gif' => 'GIF',
				'zip' => 'ZIP',
				'rar' => 'RAR',
				'txt' => 'TXT',
				'htm' => 'HTM',
				'html' => 'HTML',
				'php' => 'PHP',
				'xls' => 'XLS',
				'doc' => 'DOC',
				'pdf' => 'PDF',
				'psd' => 'PSD',
				'mpg' => 'MPG',
				'mpeg' => 'MPEG',
				'mov' => 'MOV',
				'avi' => 'AVI',
			);
			
error_reporting(0);
if(!function_exists('imagecreatetruecolor')) $showthumbnails = false;
$leadon = $startdir;
if($leadon=='.') $leadon = '';
if((substr($leadon, -1, 1)!='/') && $leadon!='') $leadon = $leadon . '/';
$startdir = $leadon;

if($_GET['dir']) {
	// check this is okay.
	
	if(substr($_GET['dir'], -1, 1)!='/') {
		$_GET['dir'] = $_GET['dir'] . '/';
	}
	
	$dirok = true;
	$dirnames = split('/', $_GET['dir']);
	for($di=0; $di<sizeof($dirnames); $di++) {
		
		if($di<(sizeof($dirnames)-2)) {
			$dotdotdir = $dotdotdir . $dirnames[$di] . '/';
		}
		
		if($dirnames[$di] == '..') {
			$dirok = false;
		}
	}
	
	if(substr($_GET['dir'], 0, 1)=='/') {
		$dirok = false;
	}
	
	if($dirok) {
		 $leadon = $leadon . $_GET['dir'];
	}
}



$opendir = $leadon;
if(!$leadon) $opendir = '.';
if(!file_exists($opendir)) {
	$opendir = '.';
	$leadon = $startdir;
}

clearstatcache();
if ($handle = opendir($opendir)) {
	while (false !== ($file = readdir($handle))) { 
		// first see if this file is required in the listing
		if ($file == "." || $file == "..")  continue;
		$discard = false;
		for($hi=0;$hi<sizeof($hide);$hi++) {
			if(strpos($file, $hide[$hi])!==false) {
				$discard = true;
			}
		}
		
		if($discard) continue;
		if (@filetype($leadon.$file) == "dir") {
			if(!$showdirs) continue;
		
			$n++;
			if($_GET['sort']=="date") {
				$key = @filemtime($leadon.$file) . ".$n";
			}
			else {
				$key = $n;
			}
			$dirs[$key] = $file . "/";
		}
		else {
			$n++;
			if($_GET['sort']=="date") {
				$key = @filemtime($leadon.$file) . ".$n";
			}
			elseif($_GET['sort']=="size") {
				$key = @filesize($leadon.$file) . ".$n";
			}
			else {
				$key = $n;
			}
			$files[$key] = $file;
			
			if($displayindex) {
				if(in_array(strtolower($file), $indexfiles)) {
					header("Location: $file");
					die();
				}
			}
		}
	}
	closedir($handle); 
}

// sort our files
if($_GET['sort']=="date") {
	@ksort($dirs, SORT_NUMERIC);
	@ksort($files, SORT_NUMERIC);
}
elseif($_GET['sort']=="size") {
	@natcasesort($dirs); 
	@ksort($files, SORT_NUMERIC);
}
else {
	@natcasesort($dirs); 
	@natcasesort($files);
}

// order correctly
if($_GET['order']=="desc" && $_GET['sort']!="size") {$dirs = @array_reverse($dirs);}
if($_GET['order']=="desc") {$files = @array_reverse($files);}
$dirs = @array_values($dirs); $files = @array_values($files);

?>
<!DOCTYPE html><html lang="vi"><head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title> Dashboard | Manager file </title>
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="http://uselooper.com/assets/apple-touch-icon.png">
    <link rel="shortcut icon" href="http://uselooper.com/assets/favicon.ico">
    <meta name="theme-color" content="#3063A0">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css">
    <link href="main.min.css" rel="stylesheet">
</head>
  <body>
    <div class="app">
      <main>
        <div class="wrapper">
          <div class="page">
            <div class="page-inner">
              <div class="page-section">
                <div class="section-deck">
                  <!-- .card -->
                  <div class="card card-fluid">
                    <header class="card-header"> File Manager: <b><?php echo $host; ?> </header>
                    <!-- .lits-group -->
                    <div class="lits-group list-group-flush">
                      <!-- /.lits-group-item -->
                                <?php
                                $class = 'b';
                                if($dirok) {
                                ?>
                                   <!-- .lits-group-item -->
                      <div class="list-group-item">
                        <!-- .lits-group-item-figure -->
                        <div class="list-group-item-figure">
                          <div class="has-badge">
                            <a href="<?php echo $dotdotdir;?>" class="tile tile-md bg-indigo">SP</a>
                            <a href="#up" class="user-avatar user-avatar-xs">
                              <img src="dirup.png" alt="up">
                            </a>
                          </div>
                        </div>
                        <!-- .lits-group-item-figure -->
                        <!-- .lits-group-item-body -->
                        <div class="list-group-item-body">
                          <h5 class="card-title mb-2">
                            Up to level
                          </h5>
                          <p class="card-subtitle text-muted"> <?php $mtime = filemtime($dotdotdir); $mtime = date("m/d/Y H:i:s", $mtime); $mtime = strftime("%B %e, %G %T", strtotime($mtime)); print ucfirst($mtime); ?> </p>
                          <!-- .progress -->
                          <div class="progress progress-xs bg-white">
                            <div class="progress-bar bg-indigo" role="progressbar" aria-valuenow="867" aria-valuemin="0" aria-valuemax="100" style="width: 100%">
                              <span class="sr-only">100% Complete</span>
                            </div>
                          </div>
                          <!-- /.progress -->
                        </div>
                        <!-- .lits-group-item-body -->
                      </div>
                      <!-- /.lits-group-item -->
                                <?php
                                    if($class=='b') $class='w';
                                    else $class = 'b';
                                }
                                $arsize = sizeof($dirs);
                                for($i=0;$i<$arsize;$i++) {
                                ?>
                                   <!-- .lits-group-item -->
                      <div class="list-group-item">
                        <!-- .lits-group-item-figure -->
                        <div class="list-group-item-figure">
                          <div class="has-badge">
                            <a href="<?php echo $leadon.$dirs[$i];?>" class="tile tile-md bg-indigo">FD</a>
                            <a href="#folder" class="user-avatar user-avatar-xs">
                              <img src="folder.png" alt="foter">
                            </a>
                          </div>
                        </div>
                        <!-- .lits-group-item-figure -->
                        <!-- .lits-group-item-body -->
                        <div class="list-group-item-body">
                          <h5 class="card-title mb-2">
                            <?php echo $dirs[$i];?>
                          </h5>
                          <p class="card-subtitle text-muted"> <?php $mtime = filemtime($leadon.$dirs[$i]); $mtime = date("m/d/Y H:i:s", $mtime); $mtime = strftime("%B %e, %G %T", strtotime($mtime)); print ucfirst($mtime); ?> </p>
                          <!-- .progress -->
                          <div class="progress progress-xs bg-white">
                            <div class="progress-bar bg-indigo" role="progressbar" aria-valuenow="867" aria-valuemin="0" aria-valuemax="100" style="width: 100%">
                              <span class="sr-only">100% Complete</span>
                            </div>
                          </div>
                          <!-- /.progress -->
                        </div>
                        <!-- .lits-group-item-body -->
                      </div>
                      <!-- /.lits-group-item -->
                                <?php
                                    if($class=='b') $class='w';
                                    else $class = 'b';	
                                }
                                
                                $arsize = sizeof($files);
                                for($i=0;$i<$arsize;$i++) {
                                    $icon = 'UNKNOWN';
                                    $ext = strtolower(substr($files[$i], strrpos($files[$i], '.')+1));
                                    $supportedimages = array('gif', 'png', 'jpeg', 'jpg');
                                    $thumb = '';
                                            
                                    if($filetypes[$ext]) {
                                        $icon = $filetypes[$ext];
                                    }
                                    
                                    $filename = $files[$i];
                                    if(strlen($filename)>43) {
                                        $filename = substr($files[$i], 0, 40) . '...';
                                    }
                                    
                                    $fileurl = $leadon . $files[$i];
                                ?>
                                   <!-- .lits-group-item -->
                      <div class="list-group-item">
                        <!-- .lits-group-item-figure -->
                        <div class="list-group-item-figure">
                          <div class="has-badge">
                            <a href="#<?php echo $icon;?>" class="tile tile-md bg-indigo"><?php echo $icon;?></a>
                            <a href="<?php echo $fileurl;?>" class="user-avatar user-avatar-xs">
                              <img src="download.png" alt="<?php echo $icon;?>">
                            </a>
                          </div>
                        </div>
                        <!-- .lits-group-item-figure -->
                        <!-- .lits-group-item-body -->
                        <div class="list-group-item-body">
                          <h5 class="card-title mb-2">
                            <?php echo $filename;?>
                          </h5>
                          <p class="card-subtitle text-muted"> <?php echo round(filesize($leadon.$files[$i])/1024);?>Kb - <?php $mtime = filemtime($leadon.$files[$i]); $mtime = date("m/d/Y H:i:s", $mtime); $mtime = strftime("%B %e, %G %T", strtotime($mtime)); print ucfirst($mtime); ?> </p>
                          <!-- .progress -->
                          <div class="progress progress-xs bg-white">
                            <div class="progress-bar bg-indigo" role="progressbar" aria-valuenow="867" aria-valuemin="0" aria-valuemax="100" style="width: <?php echo round(filesize($leadon.$files[$i])/1024/1024*100);?>%">
                              <span class="sr-only"><?php echo round(filesize($leadon.$files[$i])/1024/1024*100);?>% Complete</span>
                            </div>
                          </div>
                          <!-- /.progress -->
                        </div>
                        <!-- .lits-group-item-body -->
                      </div>
                      <!-- /.lits-group-item -->
                                <?php
                                    if($class=='b') $class='w';
                                    else $class = 'b';	
                                }	
                                ?>
</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
</body></html>
