insert into passengers(slug, name, biography, wikipedia_link, image)
values(
  '$ctx.args.slug',
  '$util.defaultIfNull($ctx.args.name, $ctx.args.slug)',
  nullif('$util.defaultIfNull($ctx.args.biography, "")', ''),
  nullif('$util.defaultIfNull($ctx.args.wikipedia_link, "")', ''),
  nullif('$util.defaultIfNull($ctx.args.image, "")', '')
)
on conflict (slug) do update set
  name = EXCLUDED.name,
  biography = EXCLUDED.biography,
  wikipedia_link = EXCLUDED.wikipedia_link,
  image = EXCLUDED.image

-- statementbreak

select * from passengers where slug = '$ctx.args.slug'
