create or replace
view active_session_view as (
select
	user_id,
	cast(created_at as date) as session_date
from
	logs
where
	"type" = 'SESSION'
group by
	user_id,
	cast(created_at as date));