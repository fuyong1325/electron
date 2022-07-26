; Manual
; https://www.electron.build/configuration/nsis.html#custom-nsis-script
; https://documentation.help/CTRE-NSIS/Section4.7.html
; https://nsis.sourceforge.io/Reference/SetRegView
; https://nsis.sourceforge.io/Docs/

; Reference
; https://www.jianshu.com/p/cea38eb17c3a
; https://juejin.cn/post/7018110903144955934
; https://codeantenna.com/a/a5Krbu3vPT

!define DIR_NAME "EBICOM"

Function .onVerifyInstDir
  StrLen $R0 "\${DIR_NAME}"
  StrCpy $R1 "$INSTDIR" "" -$R0
  StrCmp $R1 "\${DIR_NAME}" 0 +2
  StrCpy $INSTDIR "$INSTDIR\${PRODUCT_NAME}"

  StrLen $0 "\${DIR_NAME}\${PRODUCT_NAME}"
  StrCpy $1 "$INSTDIR" "" -$0
  StrCmp $1 "\${DIR_NAME}\${PRODUCT_NAME}" +2 0
  StrCpy $INSTDIR "$INSTDIR\${DIR_NAME}\${PRODUCT_NAME}"
FunctionEnd

; Function .onInstSuccess
;   SetRegView 64
;   WriteRegExpandStr HKLM "SOFTWARE\${APP_GUID}" InstallLocation $INSTDIR
;   WriteRegExpandStr HkCU "SOFTWARE\${APP_GUID}" InstallLocation $INSTDIR
;   SetRegView 32
;   WriteRegExpandStr HKLM "SOFTWARE\${APP_GUID}" InstallLocation $INSTDIR
;   WriteRegExpandStr HkCU "SOFTWARE\${APP_GUID}" InstallLocation $INSTDIR
; FunctionEnd

; WriteUninstaller $INSTDIR\Uninstall ${PRODUCT_NAME}.exe
; Function un.onUninstSuccess
;   SetRegView 64
;   DeleteRegKey HKLM "SOFTWARE\${APP_GUID}"
;   DeleteRegKey HkCU "SOFTWARE\${APP_GUID}"
;   SetRegView 32
;   DeleteRegKey HKLM "SOFTWARE\${APP_GUID}"
;   DeleteRegKey HkCU "SOFTWARE\${APP_GUID}"
; FunctionEnd

!macro preInit
  SetRegView 64

  ; MessageBox MB_OK "${INSTALL_REGISTRY_KEY}"
  ; MessageBox MB_OK "${APP_GUID}"

  ReadRegStr $2 HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation
  ; MessageBox MB_OK $2

  ; ReadRegStr $3 HkCU "${INSTALL_REGISTRY_KEY}" InstallLocation
  ; MessageBox MB_OK $3

  ; ReadRegStr $4 HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\${APP_GUID}" "UninstallString"
  ; MessageBox MB_OK $4

  ; StrLen $5 $2

  ${If} $2 == ""
    ; SetRegView 64
    WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "$PROGRAMFILES64\${DIR_NAME}\${PRODUCT_NAME}"
    ; WriteRegExpandStr HkCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$PROGRAMFILES64\${DIR_NAME}\${PRODUCT_NAME}"
    ; SetRegView 32
    ; WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "$PROGRAMFILES64\${DIR_NAME}\${PRODUCT_NAME}"
    ; WriteRegExpandStr HkCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$PROGRAMFILES64\${DIR_NAME}\${PRODUCT_NAME}"
  ; ${Else}
  ;   MessageBox MB_OK "Else"
  ${EndIf}
!macroend

; !macro customInit
;   StrCpy $INSTDIR "$PROGRAMFILES64\${DIR_NAME}\${PRODUCT_NAME}"
; !macroend
