import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module, NotFoundException } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { Book } from './book/book.entity';
import { BookModule } from './book/book.module';

export const graphQLModuleFactory = async () => {
  const options: ApolloDriverConfig = {
    driver: ApolloDriver,
    debug: true,
    installSubscriptionHandlers: true,
    autoSchemaFile: join(process.cwd(), 'schema.gql'),
    sortSchema: true,
    playground: true,
    introspection: true,
    bodyParserConfig: false,
    fieldResolverEnhancers: ['interceptors'],
    context: ({ req, res, connection }) => ({
      req,
      res,
      // loaders: createLoaders(req),
      connection,
    }),
    // plugins: [
    //   ApolloServerPluginLandingPageDisabled(),
    //   ApolloServerPluginUsageReporting({
    //     sendVariableValues: { all: true },
    //     sendHeaders: { all: true },
    //     fieldLevelInstrumentation: 1,
    //   }),
    // ],
    // // See https://github.com/nestjs/docs.nestjs.com/issues/394 for more context.
    // // Implementation based on https://github.com/nestjs/docs.nestjs.com/issues/394#issuecomment-582161405
    // subscriptions: {
    //   'subscriptions-transport-ws': {
    //     onConnect: async (
    //       headers: { authorization: string },
    //       websocket: any,
    //       context: { request: { headers: { cookie: any } } }
    //     ) => {
    //       const jwt = getCookie(context.request.headers.cookie, `${config.getCookiePrefix()}.session-token`);

    //       return {
    //         headers,
    //         cookies: { [`${config.getCookiePrefix()}.session-token`]: jwt },
    //       };
    //     },
    //     keepAlive: 30000,
    //   },
    // },
  };
  return options;
};

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mongo',
        dbName: ':memory:',
        debug: true,
        ensureIndexes: true,
        implicitTransactions: false,
        validate: true,
        strict: true,
        populateAfterFlush: true,
        registerRequestContext: true,
        // autoLoadEntities: false, // does not work for tests and workers, so we do it manually everywhere
        findOneOrFailHandler: (entityName, where) => {
          return new NotFoundException(
            `${entityName} where ${JSON.stringify(where)})} does not exist`,
          );
        },
        entities: [Book],
      }),
      // scope: Scope.REQUEST,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      useFactory: graphQLModuleFactory,
      driver: ApolloDriver,
    }),
    BookModule,
  ],

  providers: [AppService, AppResolver],
})
export class AppModule {}
