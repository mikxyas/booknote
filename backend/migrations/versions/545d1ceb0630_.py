"""empty message

Revision ID: 545d1ceb0630
Revises: 80eb97ca4085
Create Date: 2023-05-02 17:14:58.168840

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '545d1ceb0630'
down_revision = '80eb97ca4085'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('library', schema=None) as batch_op:
        batch_op.add_column(sa.Column('type', sa.String(length=10), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('library', schema=None) as batch_op:
        batch_op.drop_column('type')

    # ### end Alembic commands ###
