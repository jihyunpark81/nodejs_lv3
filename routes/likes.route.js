const express = require('express');
const router = express.Router();
const { Users, Posts, Likes } = require('../models');
const { Op } = require('sequelize');
const authMiddleware = require('../middlewares/auth-middleware');

router.put('/:postId/like', authMiddleware, async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = res.locals.user;
        const existPost = await Posts.findOne({ where: { postId } });
        const existLike = await Likes.findOne({
            where: {
                [Op.and]: [{ postId }, { UserId: userId }],
            },
        });
        if (!existPost) {
            return res
                .status(404)
                .json({ errorMessage: '게시글이 존재하지 않습니다.' });
        }
        const date = new Date();
        if (!existLike) {
            await Likes.create({
                UserId: userId,
                PostId: postId,
            });
            await Posts.increment('likes', {
                where: {
                    [Op.and]: [{ UserId: userId }, { PostId: postId }],
                },
            });
            return res
                .status(201)
                .json({ message: '게시글의 좋아요를 등록하였습니다.' });
        } else {
            //좋아요 취소
            await Likes.destroy({
                where: {
                    [Op.and]: [{ UserId: userId }, { PostId: postId }],
                },
            });
            await Posts.decrement('likes', {
                where: {
                    [Op.and]: [{ UserId: userId }, { PostId: postId }],
                },
            });
            return res
                .status(201)
                .json({ message: '게시글의 좋아요를 취소하였습니다.' });
        }
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .send({ errorMessage: '게시글 좋아요에 실패하였습니다.' });
    }
});

//좋아요 조회
router.get('/like', authMiddleware, async (req, res) => {
    try {
        const { userId } = res.locals.user;

        const posts = await Likes.findAll({
            attributes: ['postId'],
            include: [
                {
                    model: Posts,
                    attributes: { exclude: ['content'] },
                },

                {
                    model: Users,
                    attributes: ['nickname'],
                },
            ],
            where: [{ userId }],
            order: [['createdAt', 'DESC']],
        });
        console.log(posts);
        const postPrint = posts.map((value) => {
            return {
                postId: value.Post.postId,
                userId: value.Post.UserId,
                nickname: value.User.nickname,
                title: value.Post.title,
                likes: value.Post.likes,
                createdAt: value.Post.createdAt,
                updatedAt: value.Post.updatedAt,
            };
        });

        return res.status(200).json({ data: postPrint });
    } catch (err) {
        console.log(err);
        return res
            .status(400)
            .json({ errorMessage: '좋아요 조회에 실패하였습니다.' });
    }
});

module.exports = router;
