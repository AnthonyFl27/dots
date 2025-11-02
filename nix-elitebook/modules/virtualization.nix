{ config, pkgs, ... }:

{
  # --- Virtualización ---

  # Libvirt + QEMU
  virtualisation.libvirtd = {
     enable = true;
        qemu = {
           ovmf.enable = true;
           runAsRoot = false;
        };
  };

  programs.virt-manager.enable = true;

  # Docker
  virtualisation.docker.enable = true;

  # Paquetes adicionales de soporte
  environment.systemPackages = with pkgs; [
    qemu
    virt-viewer
    spice-gtk
    docker-compose
  ];
}

