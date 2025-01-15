use actix_web::{App, delete, error, HttpResponse, web};
use serde_derive::{Deserialize, Serialize};
use sqlx::{Error, FromRow};
use crate::{AppState, Entry};
use crate::auth::jwt::JwToken;
use crate::view::insert::insert;

#[derive(FromRow, Serialize, Deserialize)]
pub struct PendingList {
    id: i32,
    email: String,
    aptamer: String,
    target: String,
    apt_type: String,
    length: String,
    sequence: String,
    effect: String,
    reference: String,
    status: String
}
#[derive(Serialize, Deserialize, Debug)]
pub struct ApprovalList {
    id: i32,
    decision: bool
}

pub async fn view(pool: web::Data<AppState>) -> HttpResponse {
    let todo: Result<Vec<PendingList>, _> = sqlx::query_as("SELECT * FROM pending_list where status='Pending' ORDER BY email ASC")
        .fetch_all(&pool.pool)
        .await;
    match todo {
        Ok(s) => {
            let str = serde_json::to_string(&s);
            match str {
                Ok(t) => {
                    HttpResponse::Ok().body(t)
                }
                Err(e) => {
                    HttpResponse::InternalServerError().body(e.to_string())
                }
            }

        }
        Err(e) => {
            HttpResponse::InternalServerError().body(e.to_string())
        }
    }
}

pub async fn approve (pool: web::Data<AppState>, payload: web::Json<ApprovalList>) -> HttpResponse {
    if true == true {
        println!("{:?}", payload);
        if payload.decision == true {
            return match sqlx::query("UPDATE pending_list set status = 'Approved' where id=$1")
                .bind(&payload.id)
                .execute(&pool.pool)
                .await {
                Ok(_) => {
                    insert(&pool.pool, payload.id).await
                }
                Err(_) => {
                    HttpResponse::BadRequest().finish()
                }
            };
        } else {
            match sqlx::query("DELETE from pending_list where id=$1")
                .bind(&payload.id)
                .execute(&pool.pool)
                .await {
                Ok(_) => {
                    HttpResponse::Ok().finish()
                }
                Err(_) => {
                    HttpResponse::BadRequest().finish()
                }
            }
        }
    } else {
        HttpResponse::Unauthorized().finish()
    }
}

pub async fn delete_one (path: web::Path<i32>, pool: web::Data<AppState>) -> HttpResponse {
    let id = path.into_inner();
    if true == true {
        match sqlx::query("DELETE from aptamers where id=$1")
            .bind(&id)
            .execute(&pool.pool)
            .await {
            Ok(_) => {
                HttpResponse::Ok().finish()
            }
            Err(_) => {
                HttpResponse::BadRequest().finish()
            }
        }
    } else {
        HttpResponse::Unauthorized().finish()
    }
}

pub async fn edit_row(pool: web::Data<AppState>, payload: web::Json<Entry>) -> HttpResponse {
    if true == true {
        let todo = sqlx::query("UPDATE aptamers set aptamer = $1, target = $2, apt_type = $3, length = $4, sequence = $5, effect = $6, reference = $7 where id = $8")
            .bind(&payload.aptamer)
            .bind(&payload.target)
            .bind(&payload.apt_type)
            .bind(&payload.length)
            .bind(&payload.sequence)
            .bind(&payload.effect)
            .bind(&payload.reference)
            .bind(&payload.id)
            .execute(&pool.pool)
            .await;
        match todo {
            Ok(_) => {
                HttpResponse::Ok().finish()
            }
            Err(_) => {
                HttpResponse::BadRequest().finish()
            }
        }
    } else {
        HttpResponse::Unauthorized().finish()
    }
}
#[derive(FromRow, Serialize, Deserialize)]
struct GetComment {
    id: i32,
    email: String,
    comment: String
}
pub async fn view_comment ( pool: web::Data<AppState>) -> HttpResponse {
    if true == true {
        let result: Result<Vec<GetComment>, Error> = sqlx::query_as("SELECT * from comment")
            .fetch_all(&pool.pool)
            .await;
        match result {
            Ok(s) => {
                let str = serde_json::to_string(&s);
                match str {
                    Ok(t) => {
                        HttpResponse::Ok().body(t)
                    }
                    Err(e) => {
                        HttpResponse::InternalServerError().body(e.to_string())
                    }
                }
            }
            Err(e) => {
                HttpResponse::InternalServerError().body(e.to_string())
            }
        }
    } else {
        HttpResponse::Unauthorized().finish()
    }
}
#[delete("/deletecomment/{id}")]
pub async fn delete_comment (path: web::Path<i32>, pool: web::Data<AppState>) -> HttpResponse {
    if true == true {
        let id = path.into_inner();
        match sqlx::query("DELETE from comment where id=$1")
            .bind(&id)
            .execute(&pool.pool)
            .await {
            Ok(_) => {
                HttpResponse::Ok().finish()
            }
            Err(_) => {
                HttpResponse::BadRequest().finish()
            }
        }
    } else {
        HttpResponse::Unauthorized().finish()
    }
}

pub async fn insert_admin (pool: web::Data<AppState>, data: web::Json<Entry>) -> HttpResponse {
    if true == true {
        HttpResponse::Unauthorized().finish()
    } else {
        match sqlx::query("INSERT INTO aptamers (aptamer, target, apt_type, length, sequence, effect, reference) VALUES ($1, $2, $3, $4, $5, $6, $7);")
            .bind(&data.aptamer)
            .bind(&data.target)
            .bind(&data.apt_type)
            .bind(&data.length)
            .bind(&data.sequence)
            .bind(&data.effect)
            .bind(&data.reference)
            .execute(&pool.pool)
            .await
            .map_err(|e| error::ErrorBadRequest(e.to_string())) {
            Ok(_) => {
                HttpResponse::Ok().finish()
            }
            Err(_) => {
                HttpResponse::Conflict().finish()
            }
        }
    }

}