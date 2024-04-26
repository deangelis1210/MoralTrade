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

@app.route('/api/data')
def get_data():
    data = {'message': 'Hello from Flask!'}
    return jsonify(data)

@app.route('/allCompanies', methods=['GET'])
def get_all_companies():
    with app.app_context():
        with db.engine.connect() as conn:
            result = conn.execute(text('''
                                        SELECT c.name, c.ticker, e.environment, e.social, e.governance
                                        FROM Company c JOIN ESG_Score e ON c.ticker = e.ticker
                                        ORDER BY name
                                       '''))
            companies = [{'name': row[0], 'ticker': row[1], 'environment': row[2], 'social': row[3], 'governance': row[4]} for row in result]
            return jsonify({'companies': companies})


@app.route('/aboveAverageESGcompanies', methods=['GET'])
def get_companies():
    with app.app_context():
        with db.engine.connect() as conn:
            result = conn.execute(text('''
                                        SELECT c.name, c.ticker, es.total, es.environment, es.social, es.governance
                                        FROM Company c
                                        JOIN ESG_Score es ON c.ticker = es.ticker
                                        WHERE es.total > (
                                            SELECT AVG(total) FROM ESG_Score
                                        )
                                        ORDER BY es.total DESC, c.name
                                       '''))
            companies = [{'name': row[0], 'ticker': row[1], 'environment': row[2], 'social': row[3], 'governance': row[4]} for row in result]
            return jsonify({'message': companies})
        
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