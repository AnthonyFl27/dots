{ pkgs, ...}:

{
    programs.steam.enable = true;
    programs.steam.gamescopeSession.enable = true;
    programs.gamemode.enable = true;

    environment.systemPackages = with pkgs; [
        #gaming packages
        mangohud protonup-qt lutris bottles
        
        # utilities for gaming
        corectrl gwe cpu-x
        ];

} 