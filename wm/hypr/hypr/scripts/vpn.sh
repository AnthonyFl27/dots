#!/bin/bash
if mullvad status 2>/dev/null | grep -q "Connected"; then
    echo " VPN conectada"
else
    echo ""
fi
