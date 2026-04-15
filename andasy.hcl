# andasy.hcl app configuration file generated for kapee-bn on Wednesday, 11-Mar-26 09:12:19 SAST
#
# See https://github.com/quarksgroup/andasy-cli for information about how to use this file.

app_name = "kapee-bn"

app {

  env = {}

  port = 3000

  primary_region = "fsn"

  compute {
    cpu      = 1
    memory   = 256
    cpu_kind = "shared"
  }

  process {
    name = "kapee-bn"
  }

}
