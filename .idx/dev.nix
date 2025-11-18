{pkgs}: {
  channel = "stable-24.11";
  packages = [
    pkgs.nodejs_22
    pkgs.nodePackages."@angular/cli"
    pkgs.github-cli
  ];
  idx.extensions = [];
  idx.previews = {
    previews = {
      web = {
        command = [
          "npm"
          "run"
          "dev"
        ];
        manager = "web";
      };
    };
  };
}