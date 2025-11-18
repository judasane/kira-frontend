{pkgs}: {
      channel = "stable-24.11";
      packages = [
        pkgs.nodejs_22
        pkgs.nodePackages."@angular/cli"
      ];
      idx.extensions = [
      ];
      idx.previews = {
        previews = {
          web = {
            command = [
              "npm"
              "run"
              "dev"
              "--"
              "--port"
              "$PORT"
              "--host"
              "0.0.0.0"
            ];
            manager = "web";
          };
        };
      };
    }