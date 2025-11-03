{ config, pkgs, ... }:

{
  home.packages = with pkgs; [
    vscode
    zed-editor
    jetbrains.idea-ultimate
    azuredatastudio
    jetbrains.pycharm-community
  ];
}

