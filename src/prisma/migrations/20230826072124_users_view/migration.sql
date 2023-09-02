create or replace
view users_view as (
with login_data as (
select
	user_id,
	count(*) as num_login
from
	logs
where
	"type" = 'LOGIN'
group by
	user_id),
session_data as (
select
	user_id,
	max(created_at) as last_session
from
	logs
where
	"type" = 'SESSION'
group by
	user_id)
select
	u.id,
	u.email,
	u."name",
	u.has_verified_email,
	u.created_at as sign_up_date,
	coalesce(ld.num_login, 0) as num_login,
	sd.last_session
from
	users as u
left join login_data as ld on
	u.id = ld.user_id
left join session_data as sd on
	u.id = sd.user_id
order by
	u.id desc);