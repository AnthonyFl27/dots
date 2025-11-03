{ config, pkgs, ... }:

{
   programs.alacritty = {
    enable = true;
    settings = {
      cursor = {
         style = "beam";
         thickness = 0.2;
         unfocused_hollow = false;
      };

      window.opacity = 0.95;
      window.padding = { x = 30; y = 30; };
      font.normal = {
        family = "Iosevka";
      };

      font.size = 12;
    
    };
  };
}
