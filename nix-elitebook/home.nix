{ config, pkgs, ... }:

{
  home.username = "anthony";
  home.homeDirectory = "/home/anthony";
  home.stateVersion = "25.05";
  
  imports = [
     ./modules-home/code.nix
     ./modules-home/term.nix
  ];

  programs.git = {
     enable = true;
     userName = "AnthonyFl27";
     userEmail = "anthonykingfloresgarcia@gmail.com";
  };

  programs.bash = {
    enable = true;
    shellAliases = {
      
      cat = "bat";
      all="ls -lah --color=auto";
      la="ls -A";
      l="ls -CF";

      # nix alias
      rebuild = "sudo nixos-rebuild switch --flake /etc/nixos";
      testnix = "sudo nixos-rebuild test --flake /etc/nixos";
      nixclean = "sudo nix-collect-garbage -d && nix-store --optimise";
      update = "sudo nixos-rebuild switch --upgrade --flake /etc/nixos";
      search = "nix search nixpkgs";
    };

    initExtra = ''
	export PS1='\[\e[38;5;34m\]\u\[\e[0m\] in \[\e[38;5;39m\]\w\[\e[0m\] > '
    ''; 
  };

  home.packages = with pkgs; [
    telegram-desktop discord spotify obsidian keepassxc 
    libreoffice librewolf flameshot sparrow mangohud lutris
  ];
}
