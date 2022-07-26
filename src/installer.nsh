!define DIR_NAME "EBICOM"

Function .onVerifyInstDir
  StrLen $0 "\${DIR_NAME}"
  StrCpy $1 "$INSTDIR" "" -$0
  StrCmp $1 "\${DIR_NAME}" +2 0
  StrCpy $INSTDIR "$INSTDIR\${DIR_NAME}\${PRODUCT_NAME}"
FunctionEnd


