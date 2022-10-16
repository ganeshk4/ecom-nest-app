create table USER (
  ID INT(11) unsigned NOT NULL AUTO_INCREMENT,
  FIRST_NAME varchar(100),
  LAST_NAME varchar(100),
  MOBILE varchar(12) NOT NULL,
  EMAIL varchar(255),
  CREATED_AT timestamp,
  MODIFIED_AT timestamp
);

