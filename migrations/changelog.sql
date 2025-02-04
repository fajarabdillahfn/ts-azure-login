--liquibase formatted sql

--changeset fajar:0
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

--changeset fajar:1
CREATE TABLE users (
  user_id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP
);

--changeset fajar:2
CREATE TABLE roles (
  role_id UUID PRIMARY KEY,
  role_name VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP
);

--changeset fajar:3
INSERT INTO roles (role_id, role_name)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'SuperAdmin');

--changeset fajar:4
CREATE TABLE user_roles (
  user_id UUID REFERENCES users(user_id),
  role_id UUID REFERENCES roles(role_id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,
  PRIMARY KEY (user_id, role_id)
);

--changeset fajar:5
INSERT INTO users (user_id, email, name)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440002', 'fajar3abdillah@gmail.com', 'Abdillah Fajar');

--changeset fajar:6
INSERT INTO user_roles (user_id, role_id)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001');