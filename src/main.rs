mod view;
// mod r#static;
mod admin;
mod auth;

use std::fs;
use std::fs::File;
use std::io::Read;
use std::path::PathBuf;
use actix_cors::Cors;
use actix_web::middleware::Logger;
use actix_web::{HttpResponse, web::{self, ServiceConfig}, HttpRequest, Responder};
use shuttle_actix_web::ShuttleActixWeb;
use sqlx::{FromRow, PgPool};
use serde_derive::{Deserialize, Serialize};
use actix_web::dev::Service;
use actix_web::web::Data;
use include_dir::{include_dir, Dir};
use crate::admin::admin_config;
use crate::auth::auth_config;
use crate::view::view_config;

const STATIC_DIR: Dir = include_dir!("./src/static");

#[derive(Clone)]
struct AppState {
    pool: PgPool,
}
#[derive(FromRow, Serialize, Deserialize)]
struct Entry {
    id: i32,
    aptamer: String,
    target: String,
    apt_type: String,
    length: String,
    sequence: String,
    effect: String,
    reference: String
}

async fn execute_queries_from_str(pool: &PgPool, sql: &str) -> Result<(), sqlx::Error> {
    // Split queries by delimiter (;)
    let queries: Vec<&str> = sql.split(';').collect();

    // Execute each query
    for query in queries {
        let trimmed_query = query.trim();
        if !trimmed_query.is_empty() {
            sqlx::query(trimmed_query).execute(pool).await?;
        }
    }

    Ok(())
}

#[shuttle_runtime::main]
async fn actix_web(
    #[shuttle_shared_db::Postgres] pool: PgPool,
) -> ShuttleActixWeb<impl FnOnce(&mut ServiceConfig) + Send + Clone + 'static> {

    let sql = include_str!("../migrations/0001_aptamer.sql");

    match execute_queries_from_str (&pool, sql).await {
        Ok(_) => println!("Database migration successful"),
        Err(e) => eprintln!("Error during migration: {}", e),
    }

    let state: Data<AppState> = Data::new(AppState { pool });

    let config = move |cfg: &mut ServiceConfig| {
        cfg.service(
            web::scope("/v1")
                .wrap(Cors::default().allow_any_origin().allow_any_method().allow_any_header().supports_credentials())
                .wrap_fn(|req, srv| {
                    println!("{} {}", req.method(), req.uri());
                    let future = srv.call(req);
                    async {
                        let result = future.await?;
                        Ok(result)
                    }
                })
                .wrap(Logger::default())
                .configure(view_config)
                // .configure(static_config)
                .configure(admin_config)
                .configure(auth_config)
                .app_data(state),
        );
        cfg.route("/", web::get().to(index));
        cfg.route("/{file_name:.*}", web::get().to(serve_static_file));
        cfg.route("/static/{file_name:.*}", web::get().to(serve_static_file));


    };
    println!("All set!");
    Ok(config.into())
}

async fn index() -> HttpResponse {
    // Load the index.html file and return it as the response
    HttpResponse::Ok()
        .content_type("text/html")
        .body(include_str!("static/index.html"))
}

async fn serve_static_file(file_name: web::Path<String>) -> HttpResponse {
    let file = STATIC_DIR.get_file(file_name.as_str());

    match file {
        Some(file) => {
            // Automatically set the content type based on the file extension
            let content_type = if file_name.as_str().ends_with(".css") {
                "text/css"
            } else if file_name.as_str().ends_with(".js") {
                "application/javascript"
            } else if file_name.as_str().ends_with(".html") {
                "text/html"
            } else {
                "application/octet-stream"
            };

            HttpResponse::Ok()
                .content_type(content_type)
                .body(file.contents())
        }
        None => HttpResponse::NotFound().body("File not found"),
    }
}

