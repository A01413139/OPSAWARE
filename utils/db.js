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
MIIERDCCAqygAwIBAgIUAwZRoq4uPIlRq6JJHljvWJb6YbAwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvMjA2MWUwYzgtY2JiOS00YjcyLThiMDItNDI0ZDI1M2U0
NjQxIFByb2plY3QgQ0EwHhcNMjYwMjI0MjM0MjI0WhcNMzYwMjIyMjM0MjI0WjA6
MTgwNgYDVQQDDC8yMDYxZTBjOC1jYmI5LTRiNzItOGIwMi00MjRkMjUzZTQ2NDEg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBANCL+pOT
Tlnw7MCZ+RkqZBjcM5QwDhXNkrb6k4sSCDZvO1BD/ICDOVpY++7Hph9hqeWiPnsT
+FkWsimT0QA0MW4xoLdEiHZroIooi0GGEA5FT8w+JkF/fSTOQE6Th99wOrM/V/5j
1lZhtgSQgjXi04L4O8c/CjPMAEVUwVo0aQqwXTwUHVHu1zsrU4xfth37iVFdtU1x
6UxUmWJtxA2FG+mrTlshML3RziBWTx6UVxTcoCkjDtU6UKLsM59TXpBUR+hVawWO
LXHih2gIQd6PO160Fa2eQg9BWyhX3QeZm/tsr07yWOZmb69U9TUxlBksmoFhkpyE
foswsGcN+IHiMdzxFBa3/S9b93s0n8vhSbyEkOTc1RmEVAn9aZDLfLCMSFpk+0pQ
wftnM5RRoupPFdwnbp+i/6aZ1gqWyuUQ8eR/Mg3UoZQdolSILFDVLW03Xcnqy7ya
bBtqq2C8wYm+ffYLhgnIIAlF8JZKYydtTX4g3uTOt4uemv7tUERkeTPOFQIDAQAB
o0IwQDAdBgNVHQ4EFgQUJ+tz5lM+UJ/pbNaJpp6XvtDjNoYwEgYDVR0TAQH/BAgw
BgEB/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBABR+AqXrxXbB
s5aQVCR8iApI6qn4A8g8RgjpQgvOkHWuImV/8gBqYUVNOEZ+uLuIcL08j6lPpBnd
5qVzptVnAqtlYCJaemor54AnqF6WqVKx9iV1+iDpqy+l+gJjbwBXU+RZp54O4Cf4
JtIb6Yn2/atHOoQ9ofep07kgqwjayzmyuXrwePVCg0d78jeImDp0Z7BF+PopLwu2
A5Xukr168fVtvnM1YszrzWQA4bQ4PTymzkji+857AuhCbCMfwvm4pvbOn4PVKq/M
uBkmsX7cG/JqNbxGWt5q40xNn6afzQyq9BOo5VGG3drlV0d1sQuFAz10q8F/AVSp
Za331KcUeCO7G1gwL7IF9epLw4AWS8NGWuzG8pDLpJDxFWcA6VpXjK8kT4V3683T
/wU5hcavk+Ihf3lkGzVGiu4lFPQLT6aN4gatbNOyf6748Np/7byA3shCBON9D1cw
UTqm3zooou9Ypq/FRGfV90prOxVVtGCHI/sle3jaxokOIj2CDMbQ0g==
-----END CERTIFICATE-----`,
  },
};

const pool = new Pool(config);

export function db_connect() {
  return pool;
}