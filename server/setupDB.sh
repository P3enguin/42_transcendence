#!/usr/bin/env bash

sleep 2
yarn db:migrate:dev

exec "$@"