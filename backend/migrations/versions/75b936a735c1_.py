"""empty message

Revision ID: 75b936a735c1
Revises: 564bb231cdd0
Create Date: 2023-07-20 12:32:49.006141

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '75b936a735c1'
down_revision = '564bb231cdd0'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('cover',
    sa.Column('id', sa.Text(length=36), nullable=False),
    sa.Column('title', sa.String(length=100), nullable=True),
    sa.Column('cover_image', sa.Text(), nullable=True),
    sa.Column('bg_color', sa.String(length=14), nullable=True),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_cover'))
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('cover')
    # ### end Alembic commands ###
