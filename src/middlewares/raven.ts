import { FetchyError } from "../utils/error";
import {
    FetchyMiddleware,
    IFetchyMiddlewareConfig,
} from "./base";

export interface IFetchyRavenMiddlewareConfig extends IFetchyMiddlewareConfig {
    categories?: {
        error: string;
        response: string;
    };
    // tslint:disable-next-line no-any  @TODO properly declare me, please
    ravenClient: any;
}

export class FetchyRavenMiddleware extends FetchyMiddleware {
    protected config: IFetchyRavenMiddlewareConfig;

    private errorCategory: string = "fetchy-js_response_captured";
    private responseCategory: string = "fetchy-js_error_captured";

    public constructor(config: IFetchyRavenMiddlewareConfig, next) {
        super(config, next);

        if (config.categories !== undefined) {
            this.errorCategory = config.categories.error;
            this.responseCategory = config.categories.response;
        }
    }

    public async processResponse(promise0: Promise<Response>): Promise<Response> {
        return promise0
            .catch((e: FetchyError) => {
                if (e.hasErrors()) {
                    e.errors!.forEach((error) =>
                        this.captureErrorBreadcrumb(error));
                }
                if (e.hasResponses()) {
                    e.responses!.forEach((response) =>
                        this.captureResponseBreadcrumb(response.clone()));
                }

                throw e;
            });
    }

    private captureErrorBreadcrumb(error: Error): void {
        this.config.ravenClient.captureBreadcrumb({
            category: this.errorCategory,
            data: {
                message: error.message,
                name: error.name,
            },
            message: "Failed response",
        });
    }

    private captureResponseBreadcrumb(response: Response): void {
        this.config.ravenClient.captureBreadcrumb({
            category: this.responseCategory,
            data: {
                body: response.body,
                status: response.status,
            },
            message: "Error occurred",
        });
    }

}
