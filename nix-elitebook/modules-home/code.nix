{ config, pkgs, ... }:

{
  home.packages = with pkgs; [
    vscode
    zed-editor
    jetbrains.idea-ultimate
    azuredatastudio
    jetbrains.pycharm-community

    # languajes 
    python3
    python3Packages.pip

    gcc
    gnumake
    cmake
    pkg-config
  ];
}

