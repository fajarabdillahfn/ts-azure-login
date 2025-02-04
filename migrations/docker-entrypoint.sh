#!/bin/sh
set -e

liquibase clear-checksums
liquibase update
