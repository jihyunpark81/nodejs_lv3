const express = require('express');
const router = express.Router();
const { Users, Posts, Comments } = require('../models');
const { Op } = require('sequelize');
const authMiddleware = require('../middlewares/auth-middleware');

// console.error(err);

//댓글 생성
router.post('/:postId/comments', authMiddleware, async (req, res) => {
    try {
        const { comment } = req.body;
        const { postId } = req.params;
        const { userId } = res.locals.user;
        const existPost = await Posts.findOne({ where: { postId } });

        if (!existPost) {
            return res
                .status(404)
                .json({ errorMessage: '게시글이 존재하지 않습니다.' });
        }
        if (comment.length === 0) {
            return res
                .status(400)
                .json({ message: '댓글 내용을 입력해주세요.' });
        }
        if (!comment) {
            return res
                .status(412)
                .json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
        }

        await Comments.create({
            UserId: userId,
            PostId: postId,
            comment,
        });
        return res.status(201).json({ message: '댓글을 작성하였습니다.' });
    } catch (error) {
        return res
            .status(400)
            .send({ errorMessage: '댓글 작성에 실패하였습니다.' });
    }
});

//댓글 조회하기
router.get('/:postId/comments', async (req, res) => {
    try {
        const { postId } = req.params;
        const existPost = await Posts.findOne({ where: { postId } });

        if (!existPost) {
            return res
                .status(404)
                .json({ errorMessage: '게시글이 존재하지 않습니다.' });
        }
        const comments = await Comments.findAll({
            attributes: [
                'commentId',
                'PostId',
                'UserId',
                'comment',
                'createdAt',
                'updatedAt',
            ],
            include: [
                {
                    model: Users,
                    attributes: ['nickname'],
                },
            ],
            where: { postId },
        });

        const commentsPrint = comments.map((value) => {
            return {
                commentId: value.commentId,
                userId: value.UserId,
                nickname: value.User.nickname,
                comment: value.comment,
                createdAt: value.createdAt,
                updatedAt: value.updatedAt,
            };
        });
        res.status(200).json({ data: commentsPrint });
    } catch (err) {
        return res
            .status(400)
            .send({ errorMessage: '댓글 조회에 실패하였습니다.' });
    }
});

//댓글 수정 : PUT -> localhost:3000/posts/:postId/comments/:commentId

router.put('/:postId/comments/:commentId', authMiddleware, async (req, res) => {
    try {
        const { userId } = res.locals.user;
        const { postId, commentId } = req.params;
        const { comment } = req.body;
        const existPost = await Posts.findOne({ where: { postId } });
        const existComment = await Comments.findOne({ where: { commentId } });
        const post = await Posts.findOne({ where: { postId } });
        if (!existPost) {
            return res
                .status(403)
                .json({ errorMessage: '게시글이 존재하지 않습니다.' });
        } else if (existComment.UserId !== userId) {
            return res.status(403).json({
                errorMessage: '댓글 수정의 권한이 존재하지 않습니다.',
            });
        } else if (comment.length === 0) {
            return res
                .status(404)
                .json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
        } else if (!existComment) {
            return res
                .status(404)
                .json({ errorMessage: '댓글이 존재하지 않습니다.' });
        }
        try {
            const date = new Date();
            await Comments.update(
                { comment },
                {
                    where: {
                        [Op.and]: [
                            { commentId },
                            { UserId: userId },
                            { PostId: postId },
                        ],
                    },
                }
            );
            return res.status(200).json({ message: '댓글을 수정하였습니다.' });
        } catch (err) {
            return res.status(403).json({
                errorMessage: '댓글 수정이 정상적으로 처리되지 않았습니다.',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(400).send({
            errorMessage: '댓글 수정에 실패하였습니다.',
        });
    }
});

router.delete(
    '/:postId/comments/:commentId',
    authMiddleware,
    async (req, res) => {
        try {
            const { userId } = res.locals.user;
            const { postId, commentId } = req.params;
            const existPost = await Posts.findOne({ where: { postId } });
            const existComment = await Comments.findOne({
                where: { commentId },
            });
            const post = await Posts.findOne({ where: { postId } });
            if (!existPost) {
                return res
                    .status(403)
                    .json({ errorMessage: '게시글이 존재하지 않습니다.' });
            } else if (existComment.UserId !== userId) {
                return res.status(403).json({
                    errorMessage: '댓글 삭제의 권한이 존재하지 않습니다.',
                });
            } else if (!existComment) {
                return res
                    .status(404)
                    .json({ errorMessage: '댓글이 존재하지 않습니다.' });
            }
            try {
                await Comments.destroy({
                    where: {
                        [Op.and]: [
                            { commentId },
                            { UserId: userId },
                            { PostId: postId },
                        ],
                    },
                });
                return res
                    .status(200)
                    .json({ message: '댓글을 삭제하였습니다.' });
            } catch (err) {
                return res.status(403).json({
                    errorMessage: '댓글 삭제가 정상적으로 처리되지 않았습니다.',
                });
            }
        } catch (err) {
            console.log(err);
            res.status(400).send({
                errorMessage: '댓글 수정에 실패하였습니다.',
            });
        }
    }
);

module.exports = router;
