{ pkgs, ... }:

{
    home.packages = with pkgs; [
        # aplications
        telegram-desktop discord spotify
        obsidian keepassxc libreoffice
        librewolf flameshot sparrow

        # tools tui
        lazygit lazydocker gtrash wikiman duf
        btop htop nmap netscanner lynis  
  ];
}
