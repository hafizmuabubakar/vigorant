exports.up = function (knex) {
	return knex.schema
		.createTable('AuthData', (t) => {
			t.increments();
			t.integer('tenant_id').unique().notNullable();
			t.integer('user_id').unique().notNullable();
			t.text('name').notNullable();
			t.text('email').notNullable();
			t.text('access_token').notNullable();
			t.text('refresh_token').notNullable();
			t.bigInteger('expiry_time', { useTz: false });
		});
};

exports.down = function (knex) {
	return knex.schema.dropTable('AuthData');
};
