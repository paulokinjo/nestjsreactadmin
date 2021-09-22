import { TypeOrmMySqlConfig } from '../types/typeOrmMysqlConfig.type';

let dbConfig: TypeOrmMySqlConfig;

if (process.env.NODE_ENV === 'test') {
  dbConfig = {
    type: 'mysql',
    host: 'localhost',
    port: 33066,
    username: 'root',
    password: 'root',
    database: 'e2e_test',
    autoLoadEntities: true,
    synchronize: true,
    keepConnectionAlive: true,
  };
} else {
  dbConfig = {
    type: process.env.DATABASE_TYPE as 'mysql' | 'mariadb',
    host: process.env.DATABASE_HOST,
    port: Number.parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    autoLoadEntities: true,
    synchronize: true,
  };
}

export default dbConfig;
