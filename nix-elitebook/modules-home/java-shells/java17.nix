{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  packages = [
    pkgs.jdk17
    pkgs.maven
    pkgs.gradle
  ];

  shellHook = ''
    export JAVA_HOME=${pkgs.jdk17}/lib/openjdk
    echo "Shell Java 17 activada"
    java --version
  '';
}
