export type TypeOrmMySqlConfig = {
  type?: 'mysql' | 'mariadb';
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  autoLoadEntities: boolean;
  synchronize?: boolean;
  keepConnectionAlive?: boolean;
};
