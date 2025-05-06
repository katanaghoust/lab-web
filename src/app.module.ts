import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import * as path from 'path';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { CarModule } from './car/car.module';
import { SpecModule } from './spec/spec.module';
import { Request } from 'express';
import { DocumentNode } from 'graphql';
import { CacheModule } from '@nestjs/cache-manager';
import { StorageModule } from './storage/storage.module';
import { AuthModule } from './auth/auth.module'; // Импортируем CacheModule
import { SuperTokensConfig } from './config';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
      playground: true,
      debug: true,
      sortSchema: true,
      context: ({ req }: { req: Request }) => ({ req }),
      plugins: [
        {
          async requestDidStart() {
            return {
              async didResolveOperation({
                document,
              }: {
                document: DocumentNode;
              }) {
                const depth = calculateQueryDepth(document);
                const MAX_DEPTH = 5;
                if (depth > MAX_DEPTH) {
                  throw new Error(
                    `Query is too deep: ${depth}. Maximum allowed depth: ${MAX_DEPTH}`,
                  );
                }
                console.log('Query Depth:', depth);
              },
            };
          },
        },
      ],
    }),
    PrismaModule,
    CarModule,
    SpecModule,
    StorageModule,
    CacheModule.register({
      ttl: 5, // Время жизни кэша — 5 секунд
      max: 100, // Максимальное количество элементов в кэше
      isGlobal: true, // Делаем кэш глобальным, чтобы он был доступен всем модулям
    }), // Регистрируем CacheModule
    AuthModule.forRoot({
      connectionURI:
        'https://st-dev-157ceb50-29d0-11f0-8622-951f65f9b4b5.aws.supertokens.io',
      apiKey: '0Sh2trXwu4Ckk4z4aG4Ck4wDSX',
      appInfo: SuperTokensConfig.appInfo,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

function calculateQueryDepth(document: DocumentNode): number {
  let maxDepth = 0;

  function traverse(node: any, depth: number) {
    if (!node.selectionSet) return;
    maxDepth = Math.max(maxDepth, depth);
    node.selectionSet.selections.forEach((selection: any) => {
      traverse(selection, depth + 1);
    });
  }

  document.definitions.forEach((def: any) => {
    if (def.kind === 'OperationDefinition') {
      traverse(def, 1);
    }
  });

  return maxDepth;
}
