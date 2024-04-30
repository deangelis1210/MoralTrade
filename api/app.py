from flask import Flask, jsonify
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
                                        SELECT c.name, c.ticker, e.environment, e.social, e.governance, e.total
                                        FROM Company c JOIN ESG_Score e ON c.ticker = e.ticker
                                        ORDER BY name
                                       '''))
            companies = [{'name': row[0], 'ticker': row[1], 'environment': row[2], 'social': row[3], 'governance': row[4], 'esg': row[5]} for row in result]
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
            companies = [{'name': row[0], 'ticker': row[1], 'esg': row[2], 'environment': row[3], 'social': row[4], 'governance': row[5]} for row in result]
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

if __name__ == '__main__':
    app.run(debug=True)