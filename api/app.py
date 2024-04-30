from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://mvpfantasy:balls@34.31.136.100/mvpesg'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/allCompanies', methods=['GET'])
def get_all_companies():
    try:
        with app.app_context():
            with db.engine.connect() as conn:
                result = conn.execute(text('CALL get_companies_data(:data_type)'), {'data_type': 'all_companies'})
                companies = [{'name': row[0], 'ticker': row[1], 'environment': row[2], 'social': row[3], 'governance': row[4], 'esg': row[5]} for row in result]
                return jsonify({'companies': companies}), 200
    except Exception as e:
        app.logger.error('Error fetching all companies: %s', str(e))
        return jsonify({'error': 'An error occurred while fetching all companies'}), 500

@app.route('/aboveAverageESGcompanies', methods=['GET'])
def get_companies_above_average_esg():
    try:
        with app.app_context():
            with db.engine.connect() as conn:
                result = conn.execute(text('CALL get_companies_data(:data_type)'), {'data_type': 'above_average_esg'})
                companies = [{'name': row[0], 'ticker': row[1], 'esg': row[2], 'environment': row[3], 'social': row[4], 'governance': row[5]} for row in result]
                return jsonify({'companies': companies}), 200
    except Exception as e:
        app.logger.error('Error fetching above-average ESG companies: %s', str(e))
        return jsonify({'error': 'An error occurred while fetching above-average ESG companies'}), 500


@app.route('/usersInfo', methods=['GET'])
def get_users_info():
    with app.app_context():
        with db.engine.connect() as conn:
            result = conn.execute(text('''
                                        SELECT DISTINCT username, password, email, first_name, last_name
                                        FROM User
                                       '''))
            users_info = [{'username': row[0], 'password': row[1], 'email': row[2], 'first_name': row[3], 'last_name': row[4]} for row in result]
            return jsonify({'message': users_info})
        
@app.route('/insertInfo', methods=['POST'])
def insert_users_info():
    username = request.args.get('username')
    password = request.args.get('password')
    email = request.args.get('email')
    first_name = request.args.get('first_name')
    last_name = request.args.get('last_name')

    with app.app_context():
        with db.engine.connect() as conn:
            conn.execute(text(f'''
                                INSERT INTO User(username, password, email, first_name, last_name)
                                VALUES ('{username}', '{password}', '{email}', '{first_name}', '{last_name}')
                               '''))
            conn.commit()       
            return jsonify({'message': 'User information inserted successfully'})

@app.route('/loginAttempt', methods=['GET'])
def login_attempt():
    username = request.args.get('username')
    password = request.args.get('password')

    with app.app_context():
        with db.engine.connect() as conn:
            result = conn.execute(text('SELECT * FROM User WHERE username = :username AND password = :password'), {'username': username, 'password': password}).fetchone()
            if result:
                user_data = {'username': result[0], 'password': result[1], 'email': result[2], 'first_name': result[3], 'last_name': result[4]}
                return jsonify(user_data)
            else:
                return jsonify({'message': 'Invalid username or password'}), 401




if __name__ == '__main__':
    app.run(debug=True)