import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true,
    ca: `-----BEGIN CERTIFICATE-----
MIIEUDCCArigAwIBAgIUR9jl+SqIBT4NmHXrVcQ1dFKt/0QwDQYJKoZIhvcNAQEM
BQAwQDE+MDwGA1UEAww1YzE3YjcxYWUtY2MyNS00M2QzLTllMTgtNmZhODYyNmVi
MDdhIEdFTiAxIFByb2plY3QgQ0EwHhcNMjUxMTEzMDQwNTUxWhcNMzUxMTExMDQw
NTUxWjBAMT4wPAYDVQQDDDVjMTdiNzFhZS1jYzI1LTQzZDMtOWUxOC02ZmE4NjI2
ZWIwN2EgR0VOIDEgUHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCC
AYoCggGBAL6/m37/gmgS3Y9cRxi1sJcmO9P/KDylPVY2i/xLMFhE2mDUkG/Hbr5N
8JMEeWTj9rY2vYDD2Hhq9Hxi8zJIAySXDsJfA+sZM86msgDmWqASd8yv5m26S9xW
iCFpazb8ywiX/ogqWv3eemPdYAB9SEGbP92VOSNRXHr4e32spd+QwbhhBUrlm+r+
1wFC+QhGEtF8jM3ED1Gc8ikejRE3q6EFs3xu0Pnf59Xcl6q6lkEYUFeceAKaUZd6
N0ArahHh8VgRMGdgm0MRvzIfIJ1C2IhdsqLBQhOgBICUAVDq2g+37zIYh+qJ0lia
k0JsjaFQwBwiLITUgwAys6YIu5KhvPf1PmuCnW/8hTO0TqtH+LZkw1kppBz7tiCv
FQhNTakw6Lo9xg8IW06a+NpOaWK3CiGf5TxmfamCYWJiIGsYqppp40Ol4N22iy2V
rolxYge1kT1SP0AiEtw46wKnd6GsYb0Lq0Ozy/l4LkejOwBiMJ0pjKWBmUEVSVfs
XaQy/jUVeQIDAQABo0IwQDAdBgNVHQ4EFgQUblTT/6SM+rLfjClVzGRtsJutEAMw
EgYDVR0TAQH/BAgwBgEB/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQAD
ggGBACqO9iS0NYBDqZydeFPmcuvGg/ihhIpb7gsHGhaoOw0yfw19E7Wo/VGrf8dM
LtSd87iiVr3aWpzBfQRp1v2R1ty2qOsetSc6cwi5yY16jFuN8iMN75XB5iWj0qjf
MBx3jDCKkr02IuZoToJ0jG0bQTv7BN7kfsJxXtq5qgQnjzm1ECes7OpJMUL1UPmV
5XaP+ZcXIqYcv/7C7lzRkx6R4lKxzKnB0aH+LGHn0XA0bPk3pnndFV6NblQqz4e+
odmmRuW5jzMlddFKEvLK3luFUaQ8G3nVN9cSM/wqpRytPQD23WIiwBROc+BIv70S
W3MTywoespguEQasMdoqXp7Lpw7Ek6upUe8bgFzzXAnC04DAwj+TfsUphK+TFihp
zjSg2H31ggvXe91AasQ92dq0J2S9o7FMEeu3hk6wVjyD0IFEAOivBszcMTFiqst5
eWFc4FYvwmFoZNg/11pYwYpgp4SLiC1yzrIZTHxnNgUT/jW3TblyUuBDyMBLsliu
Z/TDjA==
-----END CERTIFICATE-----`,
  },
};

const pool = new Pool(config);

export function db_connect() {
  return pool;
}