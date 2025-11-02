{ config, pkgs, ... }:

{
  imports =
    [ 
      ./hardware-configuration.nix
      ./modules/virtualization.nix
    ];

  boot.kernelParams = [ "quiet" "splash" ];

  # boot
  boot = {
     loader = {
        systemd-boot = {
           enable = true;
           configurationLimit = 5;
           editor = false;
           };
  
     efi.canTouchEfiVariables = true;
        timeout = 0;
     };
  };

  networking.hostName = "nixos"; #hostname.

  # networking
  networking.networkmanager.enable = true;

  # time zone and lenguaje.
  time.timeZone = "America/Managua";
  i18n.defaultLocale = "es_MX.UTF-8";
  
  # x11
  services.xserver.enable = true;

  # kde desktop
  services.displayManager.sddm.enable = true;
  services.desktopManager.plasma6.enable = true;

  # keymap in X11
  services.xserver.xkb = {
    layout = "latam";
    variant = "";
  };

  # console keymap
  console.keyMap = "la-latin1";

  # print documents
  services.printing.enable = true;

  # sound pipewire.
  services.pulseaudio.enable = false;
  security.rtkit.enable = true;
  services.pipewire = {
    enable = true;
    alsa.enable = true;
    alsa.support32Bit = true;
    pulse.enable = true;
  };

  # services.xserver.libinput.enable = true; # touchpad support

  # user account  
  users.users.anthony = {
    isNormalUser = true;
    description = "Anthony";
    extraGroups = [ "networkmanager" "wheel" "libvirt" "docker" "virt-manager"];
    packages = with pkgs; [ 
      #packages
    ];
  };

  programs.firefox.enable = true; # firefox

  # unfree packages
  nixpkgs.config.allowUnfree = true;
 
  nixpkgs.config.permittedInsecurePackages = [
     "python3.12-ecdsa-0.19.1"
  ];

 # packages  
 environment.systemPackages = with pkgs; [ 
    # tools
    wget fastfetch git tree bat
    zip unzip curl 

    # security - tools
    nmap netscanner lynis
 
    # tools - tui 
    lazygit lazydocker gtrash wikiman duf
    btop htop neovim vim 
  ];
  
 # fonts
 fonts.packages = with pkgs; [
    iosevka 
    nerd-fonts.jetbrains-mono
 ];

  # Enable the OpenSSH daemon.
  services.openssh.enable = true;
 
  nix.settings.experimental-features = [ "nix-command" "flakes" ]; # flakes

  system.stateVersion = "25.05"; 
}
