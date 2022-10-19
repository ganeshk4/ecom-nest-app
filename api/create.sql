create table USER (
  ID INT(11) unsigned NOT NULL AUTO_INCREMENT ,
  FIRST_NAME varchar(100),
  LAST_NAME varchar(100),
  MOBILE varchar(12) NOT NULL,
  EMAIL varchar(255),
  OTP_VERIFIED tinyint DEFAULT 0,
  CREATED_AT timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  MODIFIED_AT timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  primary key (ID)
);

insert into USER (FIRST_NAME, LAST_NAME, MOBILE, EMAIL) 
values ('GANESH','Jadhav','9920566922','ganesh@ganesh.com');