Add-Type -AssemblyName System.Drawing

$imgDir = "e:\projects\working\HTML-Chirantana-studios\assets\clients"
$htmlPath = "e:\projects\working\HTML-Chirantana-studios\index.html"
$html = [System.IO.File]::ReadAllText($htmlPath)

$files = Get-ChildItem -Path $imgDir -Include *.png, *.jpg, *.jpeg, *.webp -Recurse
foreach ($file in $files) {
    try {
        $img = [System.Drawing.Image]::FromFile($file.FullName)
        $bmp = new-object System.Drawing.Bitmap($img)
        $w = $bmp.Width
        $h = $bmp.Height
        $minX = $w; $minY = $h; $maxX = -1; $maxY = -1
        
        for ($y = 0; $y -lt $h; $y++) {
            for ($x = 0; $x -lt $w; $x++) {
                $c = $bmp.GetPixel($x, $y)
                if ($c.A -gt 20 -and -not ($c.R -gt 240 -and $c.G -gt 240 -and $c.B -gt 240)) {
                    if ($x -lt $minX) { $minX = $x }
                    if ($x -gt $maxX) { $maxX = $x }
                    if ($y -lt $minY) { $minY = $y }
                    if ($y -gt $maxY) { $maxY = $y }
                }
            }
        }
        
        $img.Dispose()
        $bmp.Dispose()
        
        if ($minX -le $maxX -and $minY -le $maxY) {
            $cropW = $maxX - $minX + 1
            $cropH = $maxY - $minY + 1
            
            # calculate centers
            $actualCenterX = $minX + ($cropW / 2.0)
            $actualCenterY = $minY + ($cropH / 2.0)
            $imgCenterX = $w / 2.0
            $imgCenterY = $h / 2.0
            
            # calculate required offset in percentages (relative to original width)
            $offsetX_pct = (($imgCenterX - $actualCenterX) / $w) * 100
            $offsetY_pct = (($imgCenterY - $actualCenterY) / $h) * 100
            
            $wRatio = $w / $cropW
            $hRatio = $h / $cropH
            $scale = [math]::Min($wRatio, $hRatio)
            # dampen scale
            $scale = [math]::Max(1.0, [math]::Min($scale * 0.9, 2.5))
            
            $filename = $file.Name
            $srcStr = "src=`"assets/clients/$filename`""
            
            # Prepare transform
            $transforms = @()
            if ($scale -gt 1.1) { $transforms += "scale({0:N2})" -f $scale }
            if ([math]::Abs($offsetX_pct) -gt 2.0 -or [math]::Abs($offsetY_pct) -gt 2.0) {
                $transforms += "translate({0:N1}%, {1:N1}%)" -f $offsetX_pct, $offsetY_pct
            }
            
            if ($transforms.Length -gt 0) {
                $transformStr = $transforms -join " "
                Write-Host "Adjusting $filename -> $transformStr"
                
                # Replace in HTML
                # We do a basic string replace for the img tag
                $pattern = "<img[^>]*?src=`"assets/clients/$filename`"[^>]*?>"
                $html = [System.Text.RegularExpressions.Regex]::Replace($html, $pattern, {
                    param($m)
                    $tag = $m.Value
                    if ($tag -match 'style="([^"]*)"') {
                        $style = $matches[1]
                        if (-not ($style -match 'transform:')) {
                            $tag = $tag -replace 'style="', "style=`"transform: $transformStr; "
                        }
                    } else {
                        $tag = $tag -replace '<img ', "<img style=`"transform: $transformStr;`" "
                    }
                    return $tag
                }, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
            }
        }
    } catch {
        Write-Host "Error on $($file.Name): $_"
    }
}

[System.IO.File]::WriteAllText($htmlPath, $html, [System.Text.Encoding]::UTF8)
Write-Host "Done!"
