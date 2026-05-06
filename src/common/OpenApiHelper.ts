import { applyDecorators } from '@nestjs/common';
import { ApiQuery, ApiResponseOptions } from '@nestjs/swagger';

export default class OpenApiHelper {

  public static responseDoc: ApiResponseOptions = {
    status: 200,
    description: 'Successful response',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        data: { type: 'object' },
      },
    },
  };

  public static paginatedResponseDoc: ApiResponseOptions = {
    status: 200,
    description: 'Successful response',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            data: { type: 'array', items: { type: 'object' } }, // Adjust the type based on your actual item type
            meta: {
              type: 'object',
              properties: {
                itemsPerPage: { type: 'number' },
                totalItems: { type: 'number' },
                currentPage: { type: 'number' },
                totalPages: { type: 'number' },
                sortBy: { type: 'array' },
                search: { type: 'string' },
                filter: {
                  type: 'object',
                },
              },
            },
            link: {
              type: 'object',
              properties: {
                first: { type: 'string' },
                previous: { type: 'string' },
                current: { type: 'string' },
                next: { type: 'string' },
                last: { type: 'string' },
              },
            },
          },
        },
      },
    },
  };

  public static arrayResponseDoc: ApiResponseOptions = {
    status: 200,
    description: 'Successful response',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'array',
          items: { type: 'object' },
        },
      },
    },
  };

  public static nullResponseDoc: ApiResponseOptions = {
    status: 200,
    description: 'Successful response',
    schema: {
      oneOf: [
        {
          type: 'object',
          properties: {
            statusCode: { type: 'number' },
            message: { type: 'string' },
            data: {
              type: 'string',
              nullable: true,
              description: 'Nothing is returned',
            },
          },
        },
      ],
    },
  };

  public static errorResponseDoc: ApiResponseOptions = {
    status: 200,
    description: 'Successful response',
    schema: {
      oneOf: [
        {
          type: 'object',
          properties: {
            statusCode: { type: 'number' },
            message: { type: 'string' },
            error: {
              type: 'object',
            },
          },
        },
      ],
    },
  };

  /**
   * Compose decorator that adds all standard `nestjs-paginate` query params
   * to the Swagger docs for a paginated endpoint.
   *
   * Usage:
   *   @OpenApiHelper.ApiPaginateQuery()
   *   @Get('paginate')
   *   async findAllPaginated(@Paginate() query: PaginateQuery) { … }
   */
  public static ApiPaginateQuery() {
    return applyDecorators(
      ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (1-based)', example: 1 }),
      ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page', example: 20 }),
      ApiQuery({
        name: 'sortBy',
        required: false,
        isArray: true,
        type: String,
        description: 'Sort columns. Format: `field:ASC` or `field:DESC`. Repeat for multiple columns.',
        example: 'createdAt:DESC',
      }),
      ApiQuery({ name: 'search', required: false, type: String, description: 'Full-text search string' }),
      ApiQuery({
        name: 'searchBy',
        required: false,
        isArray: true,
        type: String,
        description: 'Columns to search in. Defaults to all searchable columns.',
      }),
      ApiQuery({
        name: 'filter',
        required: false,
        type: String,
        description:
          'Column filters. Format: `filter.field=$eq:value`. Operators: $eq $not $null $in $gt $gte $lt $lte $btw $ilike $sw $contains. Repeat for multiple filters.',
        example: 'filter.status=$eq:PENDING',
      }),
      ApiQuery({
        name: 'select',
        required: false,
        isArray: true,
        type: String,
        description: 'Columns to include in the response.',
      }),
    );
  }
}
