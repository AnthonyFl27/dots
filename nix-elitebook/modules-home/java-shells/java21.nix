{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  packages = [
    pkgs.jdk21
    pkgs.maven
    pkgs.gradle
  ];

  shellHook = ''
    export JAVA_HOME=${pkgs.jdk21}/lib/openjdk
    echo "Shell Java 21 activada"
    java --version
  '';
}
