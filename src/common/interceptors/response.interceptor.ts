import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, map } from 'rxjs'
import { Reflector } from "@nestjs/core";

export interface Response<T> {
  status_code: number;
  message: string;
  data?: T;
}

@Injectable()
export class ResponseFormater<T> implements NestInterceptor<T, Response<T>> {
  constructor(private reflector: Reflector) { }
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        console.log(data);
        return {
          status_code: context.switchToHttp().getResponse().statusCode,
          message:
            this.reflector.get<string>(
              'response_message',
              context.getHandler(),
            ) ||
            data.message ||
            '',
          data: data ? data : {},
        };
      }),
    );
  }
}