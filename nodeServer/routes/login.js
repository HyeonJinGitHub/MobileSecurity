var express = require('express');
var router = express.Router();

var session = require('express-session');

var sequelize = require('../models').sequelize;
var User = require('../models').User;
var Medicine = require('../models').Medicine;
//var UserMedicine = require('../models').user_medicine;

router.post('/', function(req, res, next) { //로그인할 때
	var id = req.body.ID; //아이디랑 비밀번호 받아옴
	var password = req.body.Password;

	console.log(id); 
	console.log(password);

	User.findOne({ where:{ user_id: id} }) //테이블 SQL 쿼리
		.then(function(data)
		{
			if(data == null || data == undefined) { //data에는 커서가 담깁니다
				console.log("로그인 자료 없음! ID: " +id);
			
				var response = {login: 'fail'}; //json형태로
				res.json(response); //전송
			
				return;
			}
			else if(data.password != password) {
				console.log("로그인 암호 틀림! ID: " +id);
			
				var response = {login: 'fail'};
				res.json(response);
			}else{
				var sess = req.session; 
				sess.userid = id; //세션 설정
				sess.username = data.name; //세션 설정
				console.log('로그인 성공! ID: '+id);
				console.log('set session:' + sess);
			///////
				sequelize.query('select m.name, m.ingredient, m.period, m.effect, m.caution, m.company from medicines as m, user_medicine where user_medicine.userId=:ID and user_medicine.medicineId = m.id', {replacements: {ID: data.id}, type: sequelize.QueryTypes.SELECT
					}).then(function(resultSet){
					console.log(resultSet);
				});
			///////
				var response = {login: 'Success', username:data.name};
		
		
				res.json(response);
				
			}
		})
		.catch(function(err) {
			console.log('로그인 프로세스 오류 : ' + err);
		})
	
});
module.exports = router;