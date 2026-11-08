param(
  [Parameter(Mandatory = $true)][string]$Url,
  [int]$Seconds = 30
)

$deadline = (Get-Date).AddSeconds($Seconds)
do {
  try {
    $result = Invoke-RestMethod -Uri $Url -Method Get -TimeoutSec 2
    if ($result.healthy -eq $true) { exit 0 }
  } catch {
    # The process may still be starting; retry until the bounded deadline.
  }
  Start-Sleep -Milliseconds 500
} while ((Get-Date) -lt $deadline)
exit 1
